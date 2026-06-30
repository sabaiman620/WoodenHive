import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Badge } from "../ui/badge";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const CANCELLATION_WINDOW_MS = 24 * 60 * 60 * 1000;

function getRemainingCancellationMs(orderDetails, currentTime) {
  if (!orderDetails?.orderDate) {
    return 0;
  }

  const orderTime = new Date(orderDetails.orderDate).getTime();

  if (Number.isNaN(orderTime)) {
    return 0;
  }

  return Math.max(0, CANCELLATION_WINDOW_MS - (currentTime - orderTime));
}

function formatCountdown(ms) {
  if (ms <= 0) {
    return "Expired";
  }

  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function canCancelOrder(orderDetails, currentTime) {
  if (!orderDetails?.orderDate) {
    return false;
  }

  if (["cancelled", "delivered"].includes(orderDetails?.orderStatus)) {
    return false;
  }

  const orderTime = new Date(orderDetails.orderDate).getTime();

  if (Number.isNaN(orderTime)) {
    return false;
  }

  return (currentTime || Date.now()) - orderTime <= CANCELLATION_WINDOW_MS;
}

function ShoppingOrderDetailsView({
  orderDetails,
  isLoading,
  onCancelOrder,
  isCancellingOrder,
  currentTime,
}) {
  const { user } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[720px]">
        <DialogHeader className="space-y-2">
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Loading your order summary and shipping information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="rounded-xl border bg-muted/30 p-4">
                <div className="mb-2 h-4 w-24 rounded bg-muted" />
                <div className="h-5 w-32 rounded bg-muted" />
              </div>
            ))}
          </div>
          <div className="rounded-xl border p-4">
            <div className="mb-4 h-5 w-28 rounded bg-muted" />
            <div className="space-y-3">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="flex items-center gap-3 rounded-xl border p-3">
                  <div className="h-16 w-16 rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 rounded bg-muted" />
                    <div className="h-4 w-24 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    );
  }

  if (!orderDetails) {
    return (
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            We could not load this order right now. Please try again.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    );
  }

  const safeOrderDate = orderDetails.orderDate
    ? orderDetails.orderDate.split("T")[0]
    : "-";
  const safeUserName =
    orderDetails?.customerName ||
    orderDetails?.userName ||
    user?.userName ||
    "Guest";

  const statusBadgeClass =
    orderDetails?.orderStatus === "delivered"
      ? "bg-emerald-500 hover:bg-emerald-500"
      : orderDetails?.orderStatus === "cancelled"
      ? "bg-red-600 hover:bg-red-600"
      : orderDetails?.orderStatus === "processing"
      ? "bg-amber-500 hover:bg-amber-500"
      : "bg-slate-900 hover:bg-slate-900";

  const paymentBadgeClass =
    orderDetails?.paymentStatus === "paid"
      ? "bg-emerald-500 hover:bg-emerald-500"
      : orderDetails?.paymentStatus === "failed"
      ? "bg-red-600 hover:bg-red-600"
      : "bg-orange-500 hover:bg-orange-500";

  const safeCurrentTime = currentTime || Date.now();
  const remainingCancellationMs = getRemainingCancellationMs(orderDetails, safeCurrentTime);
  const isCancelable = canCancelOrder(orderDetails, safeCurrentTime) && remainingCancellationMs > 0;

  return (
    <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[720px]">
      <DialogHeader className="space-y-3 pr-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Review your order summary, item details, and shipping information.
            </DialogDescription>
          </div>
          <Badge className={`w-fit px-3 py-1 capitalize text-white ${statusBadgeClass}`}>
            {orderDetails?.orderStatus || "pending"}
          </Badge>
        </div>
      </DialogHeader>

      <div className="grid gap-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Order ID
            </p>
            <Label className="mt-2 block break-all text-sm font-semibold text-slate-900">
              {orderDetails?._id}
            </Label>
          </div>
          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Order Date
            </p>
            <Label className="mt-2 block text-sm font-semibold text-slate-900">
              {safeOrderDate}
            </Label>
          </div>
          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Payment Method
            </p>
            <Label className="mt-2 block text-sm font-semibold text-slate-900 capitalize">
              {orderDetails?.paymentMethod || "-"}
            </Label>
          </div>
          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Grand Total
            </p>
            <Label className="mt-2 block text-sm font-semibold text-slate-900">
              Rs {orderDetails?.totalAmount}
            </Label>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border p-4">
            <p className="mb-3 text-sm font-semibold text-slate-900">Payment Status</p>
            <Badge className={`px-3 py-1 capitalize text-white ${paymentBadgeClass}`}>
              {orderDetails?.paymentStatus || "pending"}
            </Badge>
            {orderDetails?.paymentId ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Transaction ID: <span className="font-medium text-slate-900">{orderDetails.paymentId}</span>
              </p>
            ) : null}
          </div>
          <div className="rounded-xl border p-4">
            <p className="mb-3 text-sm font-semibold text-slate-900">Shipping Info</p>
            <div className="grid gap-1 text-sm text-muted-foreground">
              <span className="font-medium text-slate-900">{safeUserName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>
                {orderDetails?.addressInfo?.city}
                {orderDetails?.addressInfo?.pincode
                  ? `, ${orderDetails.addressInfo.pincode}`
                  : ""}
              </span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.customerEmail || user?.email}</span>
              {orderDetails?.addressInfo?.notes ? (
                <span>Note: {orderDetails.addressInfo.notes}</span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-dashed bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Order Cancellation</p>
              <p className="text-sm text-muted-foreground">
                {isCancelable
                  ? "You can cancel this order within 24 hours of placing it."
                  : "This order is no longer eligible for cancellation."}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                Time Left: {formatCountdown(remainingCancellationMs)}
              </p>
            </div>
            {isCancelable ? (
              <Button
                variant="destructive"
                disabled={isCancellingOrder}
                onClick={onCancelOrder}
              >
                {isCancellingOrder ? "Cancelling..." : "Cancel Order"}
              </Button>
            ) : null}
          </div>
        </div>

        <Separator />

        <div className="grid gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Ordered Items</h3>
            <p className="text-sm text-muted-foreground">
              {orderDetails?.cartItems?.length || 0} item(s) included in this order.
            </p>
          </div>

          <ul className="grid gap-3">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
              ? orderDetails.cartItems.map((item, index) => (
                  <li
                    key={item?.productId || index}
                    className="flex gap-4 rounded-xl border p-3 shadow-sm"
                  >
                    {item?.image ? (
                      <img
                        src={item.image}
                        alt={item.title || "Ordered product"}
                        className="h-20 w-20 rounded-lg border object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg border bg-slate-100 text-xs text-muted-foreground">
                        No image
                      </div>
                    )}

                    <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900">{item?.title || "Product"}</p>
                        <p className="text-sm text-muted-foreground">
                          Product ID: {item?.productId || "-"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 text-sm">
                        <Badge variant="outline" className="rounded-full px-3 py-1">
                          Qty: {item?.quantity || 0}
                        </Badge>
                        <Badge variant="outline" className="rounded-full px-3 py-1">
                          Rs {item?.price}
                        </Badge>
                      </div>
                    </div>
                  </li>
                ))
              : (
                <li className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  No item details are available for this order.
                </li>
              )}
          </ul>
        </div>
      </div>
    </DialogContent>
  );
}

ShoppingOrderDetailsView.propTypes = {
  isLoading: PropTypes.bool,
  isCancellingOrder: PropTypes.bool,
  currentTime: PropTypes.number,
  onCancelOrder: PropTypes.func,
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
    customerEmail: PropTypes.string,
    orderStatus: PropTypes.string,
    cartItems: PropTypes.arrayOf(
      PropTypes.shape({
        productId: PropTypes.string,
        title: PropTypes.string,
        quantity: PropTypes.number,
        price: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]),
        image: PropTypes.string,
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
