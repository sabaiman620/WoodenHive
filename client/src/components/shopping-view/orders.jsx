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
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelOrderByUser,
  getAllOrdersByUserId,
  getGuestOrdersByIdAndEmail,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";
import { 
  getOrCreateGuestId, 
  createNewGuestSession, 
  getGuestEmail 
} from "@/lib/utils";

const CANCELLATION_WINDOW_MS = 24 * 60 * 60 * 1000;

function getRemainingCancellationMs(orderDate, currentTime) {
  if (!orderDate) {
    return 0;
  }

  const orderTime = new Date(orderDate).getTime();

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

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [currentGuestId, setCurrentGuestId] = useState(null);
  const [guestEmail, setGuestEmailState] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails, isLoading, isCancellingOrder } = useSelector((state) => state.shopOrder);
  const { toast } = useToast();
  
  const effectiveUserId = user?.id || currentGuestId || getOrCreateGuestId();
  const effectiveEmail = guestEmail || getGuestEmail();

  function handleFetchOrderDetails(getId) {
    setOpenDetailsDialog(true);
    dispatch(getOrderDetails(getId));
  }

  function canCancelOrder(orderItem) {
    if (!orderItem) {
      return false;
    }

    if (["cancelled", "delivered"].includes(orderItem.orderStatus)) {
      return false;
    }

    return getRemainingCancellationMs(orderItem.orderDate, currentTime) > 0;
  }

  function refreshOrders() {
    if (user) {
      dispatch(getAllOrdersByUserId(user.id));
      return;
    }

    if (effectiveUserId) {
      dispatch(
        getGuestOrdersByIdAndEmail({
          guestId: effectiveUserId,
          email: effectiveEmail || "no-email",
        })
      );
    }
  }

  function handleCancelOrder() {
    if (!orderDetails?._id) {
      return;
    }

    const isConfirmed = window.confirm("Are you sure you want to cancel this order?");

    if (!isConfirmed) {
      return;
    }

    dispatch(
      cancelOrderByUser({
        orderId: orderDetails._id,
        userId: effectiveUserId,
        customerEmail: effectiveEmail,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data.payload.message || "Order cancelled successfully.",
        });
        refreshOrders();
        dispatch(getOrderDetails(orderDetails._id));
      } else {
        toast({
          title: data?.payload?.message || "Unable to cancel order.",
          variant: "destructive",
        });
      }
    });
  }

  function handleCancelOrderFromList(orderItem) {
    if (!orderItem?._id || !canCancelOrder(orderItem)) {
      return;
    }

    const isConfirmed = window.confirm("Are you sure you want to cancel this order?");

    if (!isConfirmed) {
      return;
    }

    dispatch(
      cancelOrderByUser({
        orderId: orderItem._id,
        userId: effectiveUserId,
        customerEmail: effectiveEmail,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data.payload.message || "Order cancelled successfully.",
        });
        refreshOrders();

        if (orderDetails?._id === orderItem._id) {
          dispatch(getOrderDetails(orderItem._id));
        }
      } else {
        toast({
          title: data?.payload?.message || "Unable to cancel order.",
          variant: "destructive",
        });
      }
    });
  }

  // Create new guest session and refresh orders
  function handleCreateNewGuestSession() {
    const newGuestId = createNewGuestSession();
    console.log('Created new guest session:', newGuestId);
    setCurrentGuestId(newGuestId);
    setGuestEmailState(null);
    
    // Fetch orders for the new guest ID
    if (newGuestId) {
      if (user) {
        dispatch(getAllOrdersByUserId(user.id));
      } else {
        dispatch(getGuestOrdersByIdAndEmail({ 
          guestId: newGuestId, 
          email: effectiveEmail || 'no-email' 
        }));
      }
    }
  }

  // Initialize guest data
  useEffect(() => {
    if (!user) {
      if (!currentGuestId) {
        setCurrentGuestId(getOrCreateGuestId());
      }
      if (!guestEmail) {
        setGuestEmailState(getGuestEmail());
      }
    }
  }, [currentGuestId, guestEmail, user]);

  // Fetch orders when user or guest data changes
  useEffect(() => {
    if (user) {
      // Authenticated user - fetch by user ID
      console.log('Fetching orders for logged in user:', user.id);
      dispatch(getAllOrdersByUserId(user.id));
    } else if (effectiveUserId) {
      // Guest user - fetch by guest ID and email
      console.log('Fetching guest orders for ID:', effectiveUserId, 'Email:', effectiveEmail);
      dispatch(getGuestOrdersByIdAndEmail({ 
        guestId: effectiveUserId, 
        email: effectiveEmail || 'no-email' 
      }));
    }
  }, [dispatch, effectiveUserId, effectiveEmail, user]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        
        {/* User session info */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            {user ? 
              `Logged in as: ${user.userName} (${user.id})` : 
              `Guest User: ${effectiveUserId?.slice(0, 8)}...`
            }
          </p>
          
          {/* Show email for guest users */}
          {!user && effectiveEmail && (
            <p className="text-xs">
              Tracking orders for: {effectiveEmail}
            </p>
          )}
          
          {/* Show troubleshooting button only for guest users */}
          {!user && (
            <div className="flex items-center gap-2">
              <span className="text-xs">See wrong orders or missing orders?</span>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCreateNewGuestSession}
                className="text-xs h-6 px-2"
              >
                Reset Session
              </Button>
            </div>
          )}
          
          {/* Show order count */}
          <p className="text-xs font-medium">
            {orderList?.length || 0} orders found
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog
          open={openDetailsDialog}
          onOpenChange={(isOpen) => {
            setOpenDetailsDialog(isOpen);
            if (!isOpen) {
              dispatch(resetOrderDetails());
            }
          }}
        >
          <ShoppingOrderDetailsView
            orderDetails={orderDetails}
            isLoading={isLoading}
            isCancellingOrder={isCancellingOrder}
            onCancelOrder={handleCancelOrder}
            currentTime={currentTime}
          />
        </Dialog>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>Cancel In</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <TableRow key={orderItem?._id}>
                  <TableCell>
                    {orderItem?.cartItems?.[0]?.image ? (
                      <img
                        src={orderItem.cartItems[0].image}
                        alt={orderItem?.cartItems?.[0]?.title || "Product"}
                        className="h-14 w-14 rounded-md border object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-md border bg-slate-100 text-[10px] text-muted-foreground">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{orderItem?._id}</TableCell>
                  <TableCell>
                    {orderItem?.orderDate ? orderItem.orderDate.split("T")[0] : "-"}
                  </TableCell>
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
                  <TableCell>Rs {orderItem?.totalAmount}</TableCell>
                  <TableCell>
                    {canCancelOrder(orderItem) ? (
                      <Badge variant="outline" className="font-mono">
                        {formatCountdown(
                          getRemainingCancellationMs(orderItem.orderDate, currentTime)
                        )}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not available</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => handleFetchOrderDetails(orderItem?._id)}>
                        View Details
                      </Button>
                      {canCancelOrder(orderItem) ? (
                        <Button
                          variant="destructive"
                          onClick={() => handleCancelOrderFromList(orderItem)}
                          disabled={isCancellingOrder}
                        >
                          {isCancellingOrder ? "Cancelling..." : "Cancel"}
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No orders found for this account.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
