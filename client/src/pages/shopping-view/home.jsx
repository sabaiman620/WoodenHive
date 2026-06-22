import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getOrCreateGuestId } from "@/lib/utils";

/* ================= HERO IMAGES ================= */
const heroImages = [
  { image: "/hero/slider1.jpg" },
  { image: "/hero/slider2.jpg" },
  { image: "/hero/slider3.jpg" },
];

/* ================= IMAGE BASED CATEGORIES ================= */
const categories = [
  { id: "office", label: "Office", image: "/office.jpg" },
  { id: "kitchen", label: "Kitchen", image: "/kitchen.jpg" },
  { id: "gifts", label: "Gifts", image: "/gifts.jpg" },
  { id: "accessories", label: "Accessories", image: "/accessories.jpg" },
  { id: "home", label: "Home", image: "/home.jpg" },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const productList =
    useSelector((state) => state.shopProducts?.productList) || [];
  const productDetails =
    useSelector((state) => state.shopProducts?.productDetails) || null;
  const user = useSelector((state) => state.auth?.user) || null;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  /* ================= HANDLERS ================= */
  function handleNavigateToListingPage(item, section) {
    sessionStorage.removeItem("filters");
    sessionStorage.setItem(
      "filters",
      JSON.stringify({ [section]: [item.id] })
    );
    navigate("/shop/listing");
  }

  function handleGetProductDetails(productId) {
    dispatch(fetchProductDetails(productId));
  }

  function handleAddtoCart(productId) {
    const userId = user?.id || getOrCreateGuestId();

    dispatch(
      addToCart({
        userId,
        productId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(userId));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  /* ================= EFFECTS ================= */
  useEffect(() => {
    if (productDetails) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  /* ================= UI ================= */
  return (
    <div className="flex flex-col min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {heroImages.map((slide, index) => (
          <img
            key={index}
            src={slide.image}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            alt={`hero-${index}`}
          />
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prev) => (prev - 1 + heroImages.length) % heroImages.length
            )
          }
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % heroImages.length)
          }
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon />
        </Button>
      </div>

      {/* ================= CATEGORIES ================= */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((item) => (
              <Card
                key={item.id}
                onClick={() => handleNavigateToListingPage(item, "category")}
                className="group cursor-pointer overflow-hidden rounded-xl border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-36 w-full">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>

                  <div className="absolute inset-0 flex items-end justify-center pb-4">
                    <span className="text-white text-lg font-semibold tracking-wide">
                      {item.label}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList.length > 0 ? (
              productList.map((product) => (
                <ShoppingProductTile
                  key={product._id}
                  product={product}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            ) : (
              <p className="col-span-full text-center">
                No Products Available
              </p>
            )}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
