import { LogOut, Menu, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { getOrCreateGuestId } from "@/lib/utils";

/* ================= MENU ITEMS ================= */
function MenuItems({ closeSheet }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  function handleNavigate(menuItem) {
    sessionStorage.removeItem("filters");
    // Map nav items to category filters (for listing page)
    let categoryKey = null;
    switch (menuItem.id) {
      case "office":
      case "kitchen":
      case "gifts":
      case "accessories":
      case "home":
        categoryKey = menuItem.id === "home" ? "home" : menuItem.id;
        break;
      case "home-category":
        categoryKey = "home";
        break;
      default:
        categoryKey = null;
    }

    const currentFilter = categoryKey ? { category: [categoryKey] } : null;
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (location.pathname.includes("listing") && currentFilter) {
      setSearchParams(new URLSearchParams(`?category=${categoryKey}`));
      if (typeof closeSheet === "function") closeSheet();
    } else if (categoryKey) {
      // go to listing so filters apply
      navigate("/shop/listing");
      if (typeof closeSheet === "function") closeSheet();
    } else {
      navigate(menuItem.path);
      if (typeof closeSheet === "function") closeSheet();
    }
  }

  return (
    <nav className={`flex flex-col ${closeSheet ? "px-4 py-6" : "lg:flex-row"} gap-6 lg:items-center`}>
      {shoppingViewHeaderMenuItems.map((item) => (
        <Label
          key={item.id}
          onClick={() => handleNavigate(item)}
          className={`cursor-pointer ${closeSheet ? "text-lg py-2" : "text-sm"} font-medium`}
        >
          {item.label}
        </Label>
      ))}
    </nav>
  );
}

/* ================= RIGHT CONTENT ================= */
function HeaderRightContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);
  const user = auth?.user;

  return (
    <div className="flex items-center gap-3">
      <UserCartWrapper />

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarFallback>{(user.name || "U")[0]}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/shop/account")}>
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => dispatch(logoutUser())}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/auth/login")}>
            Login
          </Button>
          <Button size="sm" onClick={() => navigate("/auth/register")}>
            Register
          </Button>
        </div>
      )}
    </div>
  );
}

/* ================= SHOPPING HEADER ================= */
function ShoppingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      {/* ✅ Navbar height SAME (h-16) */}
      <div className="flex h-18 items-center justify-between px-4 md:px-6">
        {/* ✅ Logo visually bigger WITHOUT increasing header height */}
        <Link to="/shop/home" className="flex items-center">
          <img src="/logo.png" alt="Wooden Hive" className="h-12 w-auto object-contain" />
          <span className="text-2xl font-bold font-stylish text-yellow-900 tracking-wide">Wooden Hive</span>
        </Link>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems closeSheet={() => setMobileOpen(false)} />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>

        {/* Desktop */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;

