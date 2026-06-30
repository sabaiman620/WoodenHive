const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const { sendOrderConfirmationEmail } = require("../../helpers/email");

const CANCELLATION_WINDOW_MS = 24 * 60 * 60 * 1000;

const validateTransactionId = (paymentMethod, paymentId) => {
  const normalizedPaymentMethod = paymentMethod?.trim() || "";
  const normalizedPaymentId = paymentId?.toString().trim() || "";

  if (normalizedPaymentMethod === "Cash on Delivery") {
    return { isValid: true, normalizedPaymentId: "" };
  }

  if (!normalizedPaymentId) {
    return {
      isValid: false,
      message: "Transaction ID is required for online payments.",
    };
  }

  if (!/^\d+$/.test(normalizedPaymentId)) {
    return {
      isValid: false,
      message: "Transaction ID must contain digits only.",
    };
  }

  if (normalizedPaymentMethod === "JazzCash" && normalizedPaymentId.length !== 12) {
    return {
      isValid: false,
      message: "JazzCash transaction ID must be exactly 12 digits.",
    };
  }

  if (![11, 12].includes(normalizedPaymentId.length)) {
    return {
      isValid: false,
      message: "Transaction ID must be 11 or 12 digits.",
    };
  }

  return { isValid: true, normalizedPaymentId };
};

const canCancelOrderWithinWindow = (orderDate) => {
  if (!orderDate) {
    return false;
  }

  const placedAt = new Date(orderDate).getTime();

  if (Number.isNaN(placedAt)) {
    return false;
  }

  return Date.now() - placedAt <= CANCELLATION_WINDOW_MS;
};

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      customerEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    // Validate email
    if (!customerEmail) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required",
      });
    }

    const transactionValidation = validateTransactionId(paymentMethod, paymentId);

    if (!transactionValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: transactionValidation.message,
      });
    }

    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      customerEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId: transactionValidation.normalizedPaymentId,
      payerId,
    });

    // Save order
    await newlyCreatedOrder.save();

    // Update stock for each product in the order
    for (let item of newlyCreatedOrder.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${item.title}`,
        });
      }

      product.totalStock -= item.quantity;
      await product.save();
    }

    // Clear cart once order is created
    if (cartId) {
      await Cart.findByIdAndDelete(cartId);
    }

    // Send order confirmation email
    try {
      const orderDetails = {
        orderId: newlyCreatedOrder._id,
        cartItems: newlyCreatedOrder.cartItems,
        addressInfo: newlyCreatedOrder.addressInfo,
        totalAmount: newlyCreatedOrder.totalAmount,
        paymentMethod: newlyCreatedOrder.paymentMethod,
        orderDate: newlyCreatedOrder.orderDate,
        paymentId: newlyCreatedOrder.paymentId,
      };

      await sendOrderConfirmationEmail(customerEmail, orderDetails);
      console.log(`Order confirmation email sent to: ${customerEmail}`);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newlyCreatedOrder,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate that userId is provided and not empty
    if (!userId || userId.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find orders specifically for this user only
    const orders = await Order.find({
      userId: userId.trim(),
    }).sort({ orderDate: -1 }); // Sort by newest first

    console.log(
      `Fetching orders for user: ${userId}, found: ${orders.length} orders`,
    );

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// Get orders for guest users by guest ID and email
const getGuestOrdersByIdAndEmail = async (req, res) => {
  try {
    const { guestId, email } = req.params;

    if (!guestId && !email) {
      return res.status(400).json({
        success: false,
        message: "Either guest ID or email is required",
      });
    }

    // Build query conditions
    const queryConditions = [];

    // Add guest ID condition if provided
    if (guestId && guestId.trim() !== "") {
      queryConditions.push({ userId: guestId.trim() });
    }

    // Add email condition if provided
    if (email && email.trim() !== "") {
      queryConditions.push({ customerEmail: email.trim().toLowerCase() });
    }

    // Find orders matching either guest ID or email
    const orders = await Order.find({
      $or: queryConditions,
    }).sort({ orderDate: -1 });

    console.log(
      `Fetching guest orders for ID: ${guestId}, Email: ${email}, found: ${orders.length} orders`,
    );

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const cancelOrderByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, customerEmail } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    const normalizedEmail = customerEmail?.trim().toLowerCase();
    const hasMatchingUserId = userId && order.userId === userId;
    const hasMatchingEmail = normalizedEmail && order.customerEmail === normalizedEmail;

    if (!hasMatchingUserId && !hasMatchingEmail) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this order.",
      });
    }

    if (order.orderStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This order is already cancelled.",
      });
    }

    if (order.orderStatus === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered orders cannot be cancelled.",
      });
    }

    if (!canCancelOrderWithinWindow(order.orderDate)) {
      return res.status(400).json({
        success: false,
        message: "Orders can only be cancelled within 24 hours of placement.",
      });
    }

    for (const item of order.cartItems || []) {
      if (!item?.productId || !item?.quantity) {
        continue;
      }

      const product = await Product.findById(item.productId);

      if (product) {
        product.totalStock += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = "cancelled";
    order.orderUpdateDate = new Date();
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getGuestOrdersByIdAndEmail,
  getOrderDetails,
  cancelOrderByUser,
};
