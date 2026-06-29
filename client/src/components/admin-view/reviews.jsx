import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import StarRatingComponent from "../common/star-rating";
import {
  deleteReviewForAdmin,
  getAllReviewsForAdmin,
  updateReviewApprovalStatus,
} from "@/store/admin/review-slice";

function AdminReviewsView() {
  const [selectedReview, setSelectedReview] = useState(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
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

  function handleOpenReviewDetails(review) {
    setSelectedReview(review);
    setOpenReviewDialog(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-7 gap-4 text-sm font-semibold border-b pb-2">
          <span>Review ID</span>
          <span>Product</span>
          <span>Product ID</span>
          <span>User</span>
          <span>Rating</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        {reviewList && reviewList.length > 0 ? (
          reviewList.map((review) => (
            <div
              key={review._id}
              className="grid grid-cols-7 gap-4 items-center border-b py-2 text-sm"
            >
              <span className="truncate" title={review._id}>
                {review._id}
              </span>
              <span>
                {review.product?.images?.[0] || review.product?.image ? (
                  <img
                    src={review.product?.images?.[0] || review.product.image}
                    alt={review.product?.title || "Product"}
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
                <StarRatingComponent rating={review.reviewValue || 0} size="small" />
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenReviewDetails(review)}
                >
                  View Details
                </Button>
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

        <Dialog
          open={openReviewDialog}
          onOpenChange={(open) => {
            setOpenReviewDialog(open);
            if (!open) {
              setSelectedReview(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[520px]">
            <DialogTitle>Review Details</DialogTitle>
            {selectedReview ? (
              <div className="space-y-6 pt-4">
                <div className="grid gap-4 sm:grid-cols-[120px_1fr] items-start">
                  {selectedReview.product?.images?.[0] || selectedReview.product?.image ? (
                    <img
                      src={selectedReview.product?.images?.[0] || selectedReview.product.image}
                      alt={selectedReview.product?.title || "Product"}
                      className="h-28 w-28 rounded-md object-cover border"
                    />
                  ) : (
                    <div className="h-28 w-28 rounded-md bg-slate-100 border" />
                  )}
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Review ID</p>
                      <p className="font-medium break-all">{selectedReview._id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Product</p>
                      <p className="font-medium">
                        {selectedReview.product?.title || selectedReview.productId}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={`py-1 px-3 ${
                          selectedReview.isApproved ? "bg-green-500" : "bg-black"
                        }`}
                      >
                        {selectedReview.isApproved ? "Approved" : "Pending"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {selectedReview.createdAt
                          ? new Date(selectedReview.createdAt).toLocaleString()
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium">User</p>
                    <p>{selectedReview.userName || "Guest"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Rating</p>
                    <div className="flex items-center">
                      <StarRatingComponent rating={selectedReview.reviewValue || 0} size="small" />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Review Message</p>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {selectedReview.reviewMessage || "No message provided."}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">
                Select a review to view details.
              </p>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default AdminReviewsView;

