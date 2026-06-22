import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StarRatingComponent from "@/components/common/star-rating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { getOrCreateGuestId } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [mainImage, setMainImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);

  const productDetails = useSelector((state) => state.shoppingProducts?.productDetails) || null;
  const user = useSelector((state) => state.auth?.user) || null;
  const cartItems = useSelector((state) => state.shopCart?.cartItems) || { items: [] };
  const reviews = useSelector((state) => state.shopReview?.reviews) || [];

  const { toast: showToast } = useToast();

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
      setMainImage(
        (productDetails.images && productDetails.images[0]) || productDetails.image || ""
      );

      // Fetch related products
      if (productDetails.category) {
        dispatch(
          fetchAllFilteredProducts({ filterParams: { category: productDetails.category }, sortParams: "" })
        ).then((res) => {
          const related = (res?.payload?.data || [])
            .filter((p) => p._id !== productDetails._id)
            .slice(0, 6);
          setRelatedProducts(related);
        });
      }
    }
  }, [productDetails, dispatch]);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart() {
    const getCartItems = cartItems?.items || [];
    const getCurrentProductId = productDetails?._id;
    const getTotalStock = productDetails?.totalStock;

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          showToast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    const userId = user?.id || getOrCreateGuestId();

    dispatch(
      addToCart({
        userId,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(userId));
        showToast({
          title: "Product added to cart",
        });
      }
    });
  }

  function handleAddReview() {
    if (!reviewMsg.trim()) {
      showToast({
        title: "Please write a review message",
        variant: "destructive",
      });
      return;
    }

    const effectiveUserId = user?.id || getOrCreateGuestId();
    const effectiveUserName = user?.userName || "Guest";

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: effectiveUserId,
        userName: effectiveUserName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        showToast({
          title: "Review submitted successfully! Awaiting admin approval",
        });
      }
    });
  }

  const averageReview =
    reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length
      : 0;

  if (!productDetails) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const imageList =
    (productDetails.images && productDetails.images.length > 0
      ? productDetails.images
      : productDetails?.image
      ? [productDetails.image]
      : []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Product Details</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="flex gap-4 flex-col-reverse md:flex-row">
              <div className="flex gap-2 md:flex-col md:w-20">
                {imageList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMainImage(img)}
                    className={`overflow-hidden rounded-lg border-2 transition-all ${
                      mainImage === img ? "border-primary ring-2 ring-primary" : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt={`thumb-${idx}`} className="h-20 w-20 object-cover" />
                  </button>
                ))}
              </div>
              <div className="flex-1">
                <div className="relative overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={mainImage || productDetails?.image || ""}
                    alt={productDetails?.title || "Product Image"}
                    className="w-full h-auto object-cover aspect-square"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-start">
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-3">{productDetails?.title}</h1>

              {/* Specifications */}
              <div className="mb-6">
                {productDetails?.size && (
                  <div className="mb-3">
                    <span className="text-sm font-semibold text-gray-600 uppercase">Size</span>
                    <div className="mt-2">
                      <span className="inline-block px-4 py-2 rounded-lg bg-gray-100 font-medium">
                        {productDetails.size}
                      </span>
                    </div>
                  </div>
                )}

                {productDetails?.colors && productDetails.colors.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-semibold text-gray-600 uppercase">Colors</span>
                    <div className="mt-2 flex gap-2">
                      {productDetails.colors.map((c, i) => (
                        <button
                          key={i}
                          type="button"
                          className="px-4 py-2 rounded-lg border-2 border-gray-200 font-medium text-white transition-all hover:border-primary"
                          style={{ background: c.toLowerCase() }}
                          title={c}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6 text-gray-700 leading-relaxed">
                {productDetails?.description ? (
                  productDetails.description.split("\n").map((para, i) => (
                    <p key={i} className="mb-3">
                      {para}
                    </p>
                  ))
                ) : (
                  <p>No description available</p>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Price & Rating */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <p
                  className={`text-3xl font-bold ${
                    productDetails?.salePrice > 0 ? "line-through text-gray-500" : "text-primary"
                  }`}
                >
                  Rs {productDetails?.price || 0}
                </p>
                {productDetails?.salePrice > 0 && (
                  <p className="text-3xl font-bold text-primary">
                    Rs {productDetails.salePrice}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  <StarRatingComponent rating={averageReview} />
                </div>
                <span className="text-gray-600">
                  ({averageReview.toFixed(2)}) · {reviews.length} reviews
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="mb-6">
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full py-6 text-lg opacity-60 cursor-not-allowed" disabled>
                  Out of Stock
                </Button>
              ) : (
                <Button
                  className="w-full py-6 text-lg font-semibold"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              )}
            </div>

            {/* Stock Info */}
            {productDetails?.totalStock > 0 && (
              <p className="text-sm text-green-600 font-medium">
                ✓ {productDetails.totalStock} items in stock
              </p>
            )}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Tabbed Reviews / Submit + Related Products on right */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-6 border-b">
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 ${activeTab === "reviews" ? "text-black border-b-2 border-black font-semibold" : "text-gray-600"}`}
              >
                Reviews
              </button>
              <button
                onClick={() => setActiveTab("submit")}
                className={`pb-3 ${activeTab === "submit" ? "text-black border-b-2 border-black font-semibold" : "text-gray-600"}`}
              >
                Submit Review
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: reviews or form (large) */}
            <div className="lg:col-span-2">
              {activeTab === "reviews" ? (
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((reviewItem, index) => (
                      <div className="p-6 bg-white rounded-lg border" key={index}>
                        <div className="flex gap-4">
                          <Avatar className="w-12 h-12 border">
                            <AvatarFallback>{reviewItem?.userName?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-lg">{reviewItem?.userName || "User"}</h4>
                              <div className="text-sm text-gray-600">{reviewItem?.reviewValue} / 5</div>
                            </div>
                            <div className="mt-2">
                              <StarRatingComponent rating={reviewItem?.reviewValue || 0} />
                            </div>
                            <p className="text-gray-700 mt-3">{reviewItem?.reviewMessage}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-white rounded-lg border">
                      <p className="text-gray-600">No reviews yet</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 bg-gray-50 rounded-lg border">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input type="text" placeholder="Your name (optional)" className="p-3 border rounded" />
                    <input type="email" placeholder="Your email (optional)" className="p-3 border rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 items-center">
                    <div>
                      <label className="block text-sm mb-2">Rating</label>
                      <select className="p-3 border rounded w-full">
                        <option>5 Stars</option>
                        <option>4 Stars</option>
                        <option>3 Stars</option>
                        <option>2 Stars</option>
                        <option>1 Star</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Photos (optional)</label>
                      <input type="file" className="w-full" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-2">Share your experience</label>
                    <textarea className="w-full p-3 border rounded" rows={4} />
                  </div>
                  <div className="flex gap-3">
                    <button className="bg-[#3b2a25] text-white px-6 py-2 rounded">Submit Review</button>
                    <button className="border px-6 py-2 rounded">Cancel</button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: related products */}
            <aside className="lg:col-span-1">
              <h3 className="text-xl font-bold mb-4">Related Products</h3>
              <div className="space-y-4">
                {relatedProducts.length > 0 ? (
                  relatedProducts.map((product) => (
                    <div key={product._id} className="flex items-center gap-4 p-3 border rounded cursor-pointer" onClick={() => { dispatch(fetchProductDetails(product._id)); navigate(`/shop/product/${product._id}`); }}>
                      <img src={product.images?.[0] || product.image} alt={product.title} className="w-20 h-20 object-cover rounded" />
                      <div>
                        <div className="text-sm font-semibold">{product.title}</div>
                        <div className="text-sm text-gray-600">Rs {product.price}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No related products</p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About Us</h3>
              <p className="text-gray-400 text-sm">
                We provide premium quality products with excellent customer service.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="/shop/home" className="hover:text-white transition">Home</a></li>
                <li><a href="/shop/listing" className="hover:text-white transition">Shop</a></li>
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Customer Service</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition">Returns</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <p className="text-gray-400 text-sm">
                Email: info@example.com<br />
                Phone: +92 311 0719503<br />
                Address: Pakistan
              </p>
            </div>
          </div>
          <Separator className="bg-gray-700 mb-8" />
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2024 WoodenHive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ProductDetailsPage;
