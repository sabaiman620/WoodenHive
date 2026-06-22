import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Badge } from "../ui/badge";
import { DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  if (!orderDetails) {
    return null;
  }

  const safeOrderDate = orderDetails.orderDate
    ? orderDetails.orderDate.split("T")[0]
    : "-";
  const safeUserName = user?.userName || "Guest";

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogTitle>Order Details</DialogTitle>
      <DialogDescription>
        Summary and shipping information for your order.
      </DialogDescription>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{safeOrderDate}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>Rs {orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          {orderDetails?.paymentId && (
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Transaction ID</p>
              <Label>{orderDetails?.paymentId}</Label>
            </div>
          )}
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "delivered"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "cancelled"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item, index) => (
                    <li
                      key={item?.productId || index}
                      className="flex items-center justify-between"
                    >
                      <span>Title: {item.title}</span>
                      <span>Quantity: {item.quantity}</span>
                      <span>Price: Rs {item.price}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{safeUserName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

ShoppingOrderDetailsView.propTypes = {
  orderDetails: PropTypes.shape({
    _id: PropTypes.string,
    orderDate: PropTypes.string,
    totalAmount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    paymentMethod: PropTypes.string,
    paymentStatus: PropTypes.string,
    paymentId: PropTypes.string,
    orderStatus: PropTypes.string,
    cartItems: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        quantity: PropTypes.number,
        price: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]),
      })
    ),
    addressInfo: PropTypes.shape({
      address: PropTypes.string,
      city: PropTypes.string,
      pincode: PropTypes.string,
      phone: PropTypes.string,
      notes: PropTypes.string,
    }),
  }),
};

export default ShoppingOrderDetailsView;
