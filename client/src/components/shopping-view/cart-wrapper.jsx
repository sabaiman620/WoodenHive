import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";

function UserCartWrapper({ cartItems: propCartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const cartState = useSelector((s) => s.shopCart?.cartItems) || { items: [] };
  const cartItems = propCartItems || cartState?.items || [];

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative">
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {cartItems && cartItems.length > 0
            ? cartItems.map((item) => (
                <UserCartItemsContent
                  key={item?.productId || item?._id}
                  cartItem={item}
                />
              ))
            : null}
        </div>
        <div className="mt-8 space-y-4">
          <div className="flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold">Rs {totalCartAmount}</span>
          </div>
        </div>
        <Button
          onClick={() => {
            navigate("/shop/checkout");
            if (typeof setOpenCartSheet === "function") setOpenCartSheet(false);
          }}
          className="w-full mt-6"
        >
          Checkout
        </Button>
      </SheetContent>
    </Sheet>
  );
}

export default UserCartWrapper;
