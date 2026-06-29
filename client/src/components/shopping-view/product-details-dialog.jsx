import PropTypes from "prop-types";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { getOrCreateGuestId } from "@/lib/utils";

function ProductDetailsDialog({ open = false, setOpen = () => {}, productDetails = null }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewName, setReviewName] = useState("");
  const [reviewFiles, setReviewFiles] = useState([]);
  const [mainImage, setMainImage] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user) || null;
  const cartItems = useSelector((state) => state.shopCart?.cartItems) || { items: [] };
  const reviews = useSelector((state) => state.shopReview?.reviews) || [];

  const { toast } = useToast();

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    const getCartItems = cartItems?.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
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
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails(null));
    setRating(0);
    setReviewMsg("");
  }

  function setInitialMainImage(details) {
    if (!details) return;
    const first = (details.images && details.images.length > 0 && details.images[0]) || details.image || "";
    setMainImage(first);
  }

  function handleAddReview() {
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
        toast({
          title: "Review submitted successfully! Awaiting admin approval",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
    }
  }, [productDetails, dispatch]);

  useEffect(() => {
    setInitialMainImage(productDetails);
  }, [productDetails]);

  const averageReview =
    reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length
      : 0;

  const imageList =
    (productDetails?.images && productDetails.images.length > 0
      ? productDetails.images
      : productDetails?.image
      ? [productDetails.image]
      : []);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
          {/* Image Gallery */}
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-4 relative overflow-hidden rounded-lg">
              <img
                src={mainImage || productDetails?.image || ""}
                alt={productDetails?.title || "Product Image"}
                width={400}
                height={400}
                className="aspect-square w-full object-cover rounded-lg"
              />
            </div>
            <div className="col-span-1 flex flex-col gap-2">
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMainImage(img)}
                  className={`overflow-hidden rounded border ${mainImage === img ? "ring-2 ring-primary" : ""}`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="h-20 w-20 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="">
            <div>
              <h1 className="text-3xl font-extrabold">{productDetails?.title || "Product Title"}</h1>
              <div className="mt-3 mb-4">
                {productDetails?.size ? (
                  <div className="mb-2">
                    <span className="text-sm font-medium mr-2">Size:</span>
                    <span className="inline-block px-3 py-1 rounded bg-gray-100 text-sm">{productDetails.size}</span>
                  </div>
                ) : null}

                {productDetails?.colors && productDetails.colors.length > 0 ? (
                  <div className="flex gap-2 items-center mb-2">
                    <span className="text-sm font-medium mr-2">Color:</span>
                    {productDetails.colors.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        className="px-3 py-1 rounded border text-sm flex items-center gap-2"
                        style={{ background: c.toLowerCase(), color: "#fff" }}
                        title={c}
                      >
                        <span className="hidden sm:inline">{c}</span>
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="prose max-w-none text-sm text-muted-foreground">
                  {productDetails?.description ? (
                    productDetails.description.split("\n").map((para, i) => (
                      <p key={i} className="mb-2">
                        {para}
                      </p>
                    ))
                  ) : (
                    <p className="mb-2">No description available</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p
                className={`text-3xl font-bold text-primary ${
                  productDetails?.salePrice > 0 ? "line-through" : ""
                }`}
              >
                Rs {productDetails?.price || 0}
              </p>
              {productDetails?.salePrice > 0 && (
                <p className="text-2xl font-bold text-muted-foreground">
                  Rs {productDetails.salePrice}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                <StarRatingComponent rating={averageReview} />
              </div>
              <span className="text-muted-foreground">
                ({averageReview.toFixed(2)})
              </span>
            </div>
            <div className="mt-5 mb-5">
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full opacity-60 cursor-not-allowed">
                  Out of Stock
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() =>
                    handleAddToCart(
                      productDetails?._id,
                      productDetails?.totalStock || 0
                    )
                  }
                >
                  Add to Cart
                </Button>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Reviews Section */}
        <div className="py-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="grid gap-6 mb-8">
            {reviews.length > 0 ? (
              reviews.map((reviewItem, index) => (
                <div className="flex gap-4 p-4 bg-gray-50 rounded-lg" key={index}>
                  <Avatar className="w-12 h-12 border">
                    <AvatarFallback>
                      {reviewItem?.userName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">{reviewItem?.userName || "User"}</h3>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <StarRatingComponent rating={reviewItem?.reviewValue || 0} />
                    </div>
                    <p className="text-muted-foreground">
                      {reviewItem?.reviewMessage || ""}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No reviews yet</p>
            )}
          </div>

          {/* Add Review Form */}
          <div className="p-6 bg-blue-50 rounded-lg border">
            <Label className="text-lg font-semibold mb-4 block">Share Your Experience</Label>
            <div className="flex gap-2 mb-4">
              <StarRatingComponent
                rating={rating}
                handleRatingChange={handleRatingChange}
              />
            </div>
            {!user && (
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}
            <div className="mb-3">
              <label className="block text-sm mb-1">Photos (optional)</label>
              <input
                type="file"
                className="w-full"
                multiple
                accept="image/*"
                onChange={(e) => setReviewFiles(Array.from(e.target.files || []))}
              />
            </div>
            <Input
              name="reviewMsg"
              value={reviewMsg}
              onChange={(event) => setReviewMsg(event.target.value)}
              placeholder="Write your review..."
              className="mb-4"
            />
            <Button
              onClick={handleAddReview}
              disabled={reviewMsg.trim() === ""}
              className="w-full"
            >
              Submit Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
ProductDetailsDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  productDetails: PropTypes.shape({
    _id: PropTypes.string,
    image: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    description: PropTypes.string,
    salePrice: PropTypes.number,
    price: PropTypes.number,
    size: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string),
    totalStock: PropTypes.number,
  }),
};
