import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
  deleteOrder,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";
import { Trash2 } from "lucide-react";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  function handleDeleteOrder(orderId) {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(orderId)).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: "Order deleted successfully!",
          });
          dispatch(getAllOrdersForAdmin());
        } else {
          toast({
            title: "Failed to delete order",
            variant: "destructive",
          });
        }
      });
    }
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  console.log(orderDetails, "orderList");

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow key={orderItem?._id}>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          orderItem?.orderStatus === "delivered"
                            ? "bg-green-500"
                            : orderItem?.orderStatus === "cancelled"
                            ? "bg-red-600"
                            : "bg-black"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          orderItem?.paymentStatus === "paid"
                            ? "bg-green-500"
                            : orderItem?.paymentStatus === "failed"
                            ? "bg-red-600"
                            : "bg-orange-500"
                        }`}
                      >
                        {orderItem?.paymentStatus || "pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>Rs {orderItem?.totalAmount}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            onClick={() =>
                              handleFetchOrderDetails(orderItem?._id)
                            }
                            size="sm"
                          >
                            View Details
                          </Button>
                          <AdminOrderDetailsView orderDetails={orderDetails} />
                        </Dialog>
                        <Button
                          onClick={() => handleDeleteOrder(orderItem?._id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
