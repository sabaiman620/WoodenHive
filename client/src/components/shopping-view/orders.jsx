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
  getAllOrdersByUserId,
  getGuestOrdersByIdAndEmail,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import { 
  getOrCreateGuestId, 
  createNewGuestSession, 
  getGuestEmail 
} from "@/lib/utils";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [currentGuestId, setCurrentGuestId] = useState(null);
  const [guestEmail, setGuestEmailState] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);
  
  const effectiveUserId = user?.id || currentGuestId || getOrCreateGuestId();
  const effectiveEmail = guestEmail || getGuestEmail();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
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
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  console.log(orderDetails, "orderDetails");

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
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
                  <TableCell>Rs {orderItem?.totalAmount}</TableCell>
                  <TableCell>
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                      >
                        View Details
                      </Button>
                      <ShoppingOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
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
