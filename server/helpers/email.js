const nodemailer = require("nodemailer");

// Create Brevo transporter
const createBrevoTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Generate order confirmation email HTML template
const generateOrderConfirmationHTML = (orderDetails) => {
  const {
    orderId,
    cartItems,
    addressInfo,
    totalAmount,
    paymentMethod,
    orderDate,
    paymentId,
  } = orderDetails;

  const itemsHTML = cartItems
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px 0;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <img src="${item.image}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
          <div>
            <h4 style="margin: 0; font-size: 16px; font-weight: 600;">${item.title}</h4>
            <p style="margin: 0; color: #666; font-size: 14px;">Quantity: ${item.quantity}</p>
          </div>
        </div>
      </td>
      <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #8B4513;">Rs ${item.price}</td>
    </tr>
  `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - WoodenHive</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); color: white; padding: 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px; font-weight: 700;">WoodenHive</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Premium Wooden Furniture</p>
            </div>
            
            <!-- Order Confirmation -->
            <div style="padding: 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="background: #e8f5e8; color: #2d5016; padding: 15px; border-radius: 8px; display: inline-block; margin-bottom: 20px;">
                        <h2 style="margin: 0; font-size: 24px;">✓ Order Confirmed!</h2>
                    </div>
                    <p style="font-size: 16px; color: #666; margin: 0;">Thank you for your purchase. Your order has been received and is being processed.</p>
                </div>
                
                <!-- Order Details -->
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    <h3 style="color: #8B4513; margin-top: 0; margin-bottom: 15px;">Order Details</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <strong>Order ID:</strong><br>
                            <span style="color: #666;">#${orderId}</span>
                        </div>
                        <div>
                            <strong>Order Date:</strong><br>
                            <span style="color: #666;">${new Date(
                              orderDate,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}</span>
                        </div>
                        <div>
                            <strong>Payment Method:</strong><br>
                            <span style="color: #666;">${paymentMethod}</span>
                        </div>
                        ${
                          paymentId
                            ? `
                        <div>
                            <strong>Transaction ID:</strong><br>
                            <span style="color: #666;">${paymentId}</span>
                        </div>
                        `
                            : ""
                        }
                    </div>
                </div>
                
                <!-- Items Ordered -->
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #8B4513; margin-bottom: 15px;">Items Ordered</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        ${itemsHTML}
                    </table>
                </div>
                
                <!-- Shipping Address -->
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    <h3 style="color: #8B4513; margin-top: 0; margin-bottom: 15px;">Shipping Address</h3>
                    <div style="color: #666; line-height: 1.8;">
                        ${addressInfo.address}<br>
                        ${addressInfo.city}, ${addressInfo.pincode}<br>
                        <strong>Phone:</strong> ${addressInfo.phone}<br>
                        ${addressInfo.notes ? `<strong>Notes:</strong> ${addressInfo.notes}` : ""}
                    </div>
                </div>
                
                <!-- Total -->
                <div style="background: #8B4513; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <h3 style="margin: 0; font-size: 20px;">Order Total: Rs ${totalAmount}</h3>
                </div>
                
                <!-- Next Steps -->
                <div style="margin-top: 30px; padding: 20px; background: #e8f4f8; border-radius: 8px;">
                    <h4 style="color: #0066cc; margin-top: 0;">What happens next?</h4>
                    <ul style="color: #666; padding-left: 20px;">
                        <li>We'll process your order within 1-2 business days</li>
                        <li>You'll receive a shipping confirmation with tracking details</li>
                        <li>Expected delivery: 3-7 business days</li>
                    </ul>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #333; color: #ccc; padding: 20px; text-align: center;">
                <p style="margin: 0 0 10px 0;">Thank you for choosing WoodenHive!</p>
                <p style="margin: 0; font-size: 14px;">If you have any questions, please contact us at info@woodenhive.com</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (customerEmail, orderDetails) => {
  try {
    const transporter = createBrevoTransporter();

    const mailOptions = {
      from: {
        name: "WoodenHive",
        address: process.env.BREVO_SENDEREMAIL,
      },
      to: customerEmail,
      subject: `Order Confirmation - #${orderDetails.orderId} | WoodenHive`,
      html: generateOrderConfirmationHTML(orderDetails),
      text: `
        Order Confirmation - WoodenHive
        
        Dear Customer,
        
        Thank you for your order! Your order #${orderDetails.orderId} has been confirmed.
        
        Order Total: Rs ${orderDetails.totalAmount}
        Payment Method: ${orderDetails.paymentMethod}
        ${orderDetails.paymentId ? `Transaction ID: ${orderDetails.paymentId}` : ""}
        
        Your order will be processed within 1-2 business days and you'll receive tracking information once shipped.
        
        Thank you for choosing WoodenHive!
        
        Best regards,
        The WoodenHive Team
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(
      "Order confirmation email sent successfully:",
      result.messageId,
    );
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return { success: false, error: error.message };
  }
};

// Test email connection
const testEmailConnection = async () => {
  try {
    const transporter = createBrevoTransporter();
    await transporter.verify();
    console.log("Email server connection successful");
    return true;
  } catch (error) {
    console.error("Email server connection failed:", error);
    return false;
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  testEmailConnection,
  generateOrderConfirmationHTML,
};
