import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import StarRatingComponent from "../common/star-rating";
import {
  deleteReviewForAdmin,
  getAllReviewsForAdmin,
  updateReviewApprovalStatus,
} from "@/store/admin/review-slice";

function AdminReviewsView() {
  const dispatch = useDispatch();
  const { reviewList } = useSelector((state) => state.adminReview);

  useEffect(() => {
    dispatch(getAllReviewsForAdmin());
  }, [dispatch]);

  function handleApprove(reviewId) {
    dispatch(updateReviewApprovalStatus({ id: reviewId, isApproved: true }));
  }

  function handleUnapprove(reviewId) {
    dispatch(updateReviewApprovalStatus({ id: reviewId, isApproved: false }));
  }

  function handleDelete(reviewId) {
    dispatch(deleteReviewForAdmin(reviewId));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-8 gap-4 text-sm font-semibold border-b pb-2">
          <span>Review ID</span>
          <span>Product Image</span>
          <span>Product ID</span>
          <span>User</span>
          <span>Rating</span>
          <span>Message</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        {reviewList && reviewList.length > 0 ? (
          reviewList.map((review) => (
            <div
              key={review._id}
              className="grid grid-cols-8 gap-4 items-center border-b py-2 text-sm"
            >
              <span className="truncate" title={review._id}>
                {review._id}
              </span>
              <span>
                {review.product?.image ? (
                  <img
                    src={review.product.image}
                    alt={review.product.title || "Product"}
                    className="w-12 h-12 object-cover rounded-md border"
                  />
                ) : (
                  <div className="w-12 h-12 bg-muted rounded-md border" />
                )}
              </span>
              <span className="truncate" title={review.productId}>
                {review.productId}
              </span>
              <span>{review.userName || "Guest"}</span>
              <span className="flex items-center">
                <StarRatingComponent
                  rating={review.reviewValue || 0}
                  size="small"
                />
              </span>
              <span className="truncate" title={review.reviewMessage}>
                {review.reviewMessage || "-"}
              </span>
              <span>
                <Badge
                  className={`py-1 px-3 ${
                    review.isApproved ? "bg-green-500" : "bg-black"
                  }`}
                >
                  {review.isApproved ? "Approved" : "Pending"}
                </Badge>
              </span>
              <span className="flex justify-end gap-2">
                {review.isApproved ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnapprove(review._id)}
                  >
                    Unapprove
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApprove(review._id)}
                  >
                    Approve
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(review._id)}
                >
                  Delete
                </Button>
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No reviews found.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default AdminReviewsView;
