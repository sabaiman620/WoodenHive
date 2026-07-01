import { useEffect, useState, useRef } from "react";
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
import { gtmAddToCart, gtmViewItem } from "@/lib/gtm";

function ProductDetailsPage() {
  const { productId, id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewName, setReviewName] = useState("");
  const [reviewFiles, setReviewFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("reviews");
  const [mainImage, setMainImage] = useState("");
  // Zoom / pan state for main image
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);
  const dragMovedRef = useRef(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const productDetails = useSelector((state) => state.shopProducts?.productDetails) || null;
  const isLoading = useSelector((state) => state.shopProducts?.isLoading) || false;
  const user = useSelector((state) => state.auth?.user) || null;
  const cartItems = useSelector((state) => state.shopCart?.cartItems) || { items: [] };
  const reviews = useSelector((state) => state.shopReview?.reviews) || [];

  const { toast: showToast } = useToast();

  useEffect(() => {
    const effectiveId = productId || id;
    console.log("ProductDetailsPage: route params", { productId, id, effectiveId });
    if (effectiveId) {
      dispatch(fetchProductDetails(effectiveId)).then((res) => {
        console.log("fetchProductDetails result:", res);
      }).catch((err) => {
        console.error("fetchProductDetails error:", err);
      });
    }
  }, [productId, id, dispatch]);

  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
      setMainImage(
        (productDetails.images && productDetails.images[0]) || productDetails.image || ""
      );
      // GTM: fire view_item once product details are available
      gtmViewItem({ product: productDetails });

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

  // Zoom handlers
  function handleZoomIn() {
    setZoom((z) => Math.min(3, Number((z + 0.25).toFixed(2))));
  }

  function handleZoomOut() {
    setZoom((z) => Math.max(1, Number((z - 0.25).toFixed(2))));
    // if zoom becomes 1, reset translate
    setTranslate((t) => (zoom <= 1.25 ? { x: 0, y: 0 } : t));
  }

  function resetZoom() {
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  }

  function onImageClick(e) {
    // ignore clicks that were part of a drag
    if (dragMovedRef.current) {
      dragMovedRef.current = false;
      return;
    }
    // toggle zoom: click to zoom in at cursor position, click again to reset
    const rect = imageContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (zoom <= 1) {
      const newZoom = 2;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const dx = (centerX - clickX) * (newZoom - 1);
      const dy = (centerY - clickY) * (newZoom - 1);
      setTranslate({ x: dx, y: dy });
      setZoom(newZoom);
    } else {
      resetZoom();
    }
  }

  function onMouseDown(e) {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragMovedRef.current = false;
    setStartPos({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    dragMovedRef.current = true;
    const x = e.clientX - startPos.x;
    const y = e.clientY - startPos.y;
    setTranslate({ x, y });
  }

  function onMouseUp() {
    setIsDragging(false);
  }

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
        // GTM: productDetails is in scope here
        gtmAddToCart({ product: productDetails, quantity: 1, source: "product_detail" });
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
    const effectiveUserName = user?.userName || (reviewName && reviewName.trim()) || "Guest";
    let payload;
    if (reviewFiles && reviewFiles.length > 0) {
      payload = new FormData();
      payload.append("productId", productDetails?._id);
      payload.append("userId", effectiveUserId);
      payload.append("userName", effectiveUserName);
      payload.append("reviewMessage", reviewMsg);
      payload.append("reviewValue", rating);
      reviewFiles.forEach((f) => payload.append("images", f));
    } else {
      payload = {
        productId: productDetails?._id,
        userId: effectiveUserId,
        userName: effectiveUserName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      };
    }

    dispatch(addReview(payload)).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        setReviewName("");
        setReviewFiles([]);
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!productDetails && !isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
        <p className="text-gray-600 mb-6">There was a problem loading this product.</p>
        <div className="flex gap-3">
          <Button onClick={() => navigate(-1)}>Go Back</Button>
          <Button variant="secondary" onClick={() => navigate('/shop/home')}>Shop Home</Button>
        </div>
      </div>
    );
  }

  const imageList =
    (productDetails.images && productDetails.images.length > 0
      ? productDetails.images
      : productDetails?.image
      ? [productDetails.image]
      : []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
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
                <div
                  ref={imageContainerRef}
                  className={`relative overflow-hidden rounded-lg bg-gray-100 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseUp}
                  onClick={onImageClick}
                >
                  <img
                    src={mainImage || productDetails?.image || ""}
                    alt={productDetails?.title || "Product Image"}
                    draggable={false}
                    style={{
                      transform: `translate(${translate.x}px, ${translate.y}px) scale(${zoom})`,
                      transition: isDragging ? 'none' : 'transform 0.18s ease',
                      willChange: 'transform',
                    }}
                    className="w-full h-auto object-cover aspect-square"
                  />

                  {/* zoom-on-click (no visible controls) */}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-start">
            <div className="mb-6">
              <h1 className="text-4xl font-serif font-extrabold mb-3">{productDetails?.title}</h1>

              {/* Price (moved up) + Rating */}
              <div className="flex items-center gap-6 mb-4">
                <div>
                  {productDetails?.salePrice > 0 ? (
                    <div>
                      <p className="text-3xl font-bold text-[#3b2a25]">Rs {productDetails.salePrice}</p>
                      <p className="text-sm line-through text-gray-500">Rs {productDetails.price}</p>
                    </div>
                  ) : (
                    <p className="text-3xl font-bold text-[#3b2a25]">Rs {productDetails?.price || 0}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <StarRatingComponent rating={averageReview} />
                  <span className="text-gray-600">({averageReview.toFixed(2)})</span>
                </div>
              </div>

              {/* Description (simple, no stars) */}
              <div className="mb-4 text-gray-700 leading-relaxed prose max-w-none">
                {productDetails?.description ? (
                  productDetails.description.split("\n").map((para, i) => (
                    <p key={i} className="mb-3 text-base">
                      {para}
                    </p>
                  ))
                ) : (
                  <p>No description available</p>
                )}
              </div>

              {/* Colors */}
              {productDetails?.colors && productDetails.colors.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Color</div>
                  <div className="flex gap-2">
                    {productDetails.colors.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        className="px-3 py-1 rounded border text-sm"
                        style={{ background: c.toLowerCase(), color: '#fff' }}
                        title={c}
                      >
                        <span className="hidden sm:inline">{c}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size in box */}
              {productDetails?.size && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Size</div>
                  <div className="inline-block px-4 py-2 border rounded-md bg-gray-50">{productDetails.size}</div>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* (Removed duplicate Price & Rating block — price shown above under product title) */}

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
                              <StarRatingComponent rating={reviewItem?.reviewValue || 0} size="small" />
                            </div>
                            <p className="text-gray-700 mt-3">{reviewItem?.reviewMessage}</p>
                            {/* render uploaded review images if present (support images array or single image) */}
                            {((reviewItem?.images && reviewItem.images.length > 0) || reviewItem?.image) && (
                              <div className="mt-3 flex gap-2">
                                {(reviewItem?.images && reviewItem.images.length > 0
                                  ? reviewItem.images
                                  : reviewItem?.image
                                  ? [reviewItem.image]
                                  : []).map((rImg, rIdx) => (
                                  <div key={rIdx} className="w-24 h-24 overflow-hidden rounded border">
                                    <img src={rImg} alt={`review-${index}-${rIdx}`} className="w-full h-full object-cover" />
                                  </div>
                                ))}
                              </div>
                            )}
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
                    <input
                      type="text"
                      placeholder="Your name (optional)"
                      className="p-3 border rounded"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                    />
                    <input type="email" placeholder="Your email (optional)" className="p-3 border rounded" />
                  </div>
                    <div className="grid grid-cols-2 gap-4 mb-4 items-center">
                    <div>
                      <label className="block text-sm mb-2">Rating</label>
                      <div>
                        <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Photos (optional)</label>
                      <input type="file" className="w-full" multiple onChange={(e) => setReviewFiles(Array.from(e.target.files))} />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-2">Share your experience</label>
                    {/* name input bound above; no duplicate here */}
                    <textarea value={reviewMsg} onChange={(e) => setReviewMsg(e.target.value)} className="w-full p-3 border rounded" rows={4} />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleAddReview} className="bg-[#3b2a25] text-white px-6 py-2 rounded">Submit Review</button>
                    <button onClick={() => setActiveTab('reviews')} className="border px-6 py-2 rounded">Cancel</button>
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
                    <div key={product._id} className="flex items-center gap-4 p-3 border rounded cursor-pointer" onClick={() => { navigate(`/shop/product/${product._id}`); }}>
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
    </div>
  );
}

export default ProductDetailsPage;
