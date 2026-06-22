import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getOrderDetails } from "@/store/shop/order-slice";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderId, orderDetails, isLoading } = useSelector(
    (state) => state.shopOrder
  );

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  const hasDetails = !!orderDetails;

  return (
    <Card className="max-w-2xl mx-auto my-10 p-8">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-3xl font-extrabold">
          Order placed successfully!
        </CardTitle>
        <CardDescription>
          Thank you for your purchase. A confirmation has been recorded for
          this order.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 p-0">
        {isLoading && <p>Loading order details...</p>}

        {!isLoading && hasDetails && (
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Order ID:</span>{" "}
              {orderDetails._id}
            </p>
            <p>
              <span className="font-semibold">Total Amount:</span>{" "}
              Rs {orderDetails.totalAmount}
            </p>
            <p>
              <span className="font-semibold">Payment Method:</span>{" "}
              {orderDetails.paymentMethod}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {orderDetails.orderStatus}
            </p>
            <p>
              <span className="font-semibold">Order Date:</span>{" "}
              {orderDetails.orderDate
                ? orderDetails.orderDate.split("T")[0]
                : "-"}
            </p>
          </div>
        )}

        {!isLoading && !hasDetails && (
          <p className="text-sm text-muted-foreground">
            Your order has been placed. If details are not visible, please
            check your orders history.
          </p>
        )}

        <div className="mt-6">
          <Button className="w-full" onClick={() => navigate("/shop/account")}>
            View Orders
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PaymentSuccessPage;
