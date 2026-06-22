const ProductReview = require("../../models/Review");
const Product = require("../../models/Product");

// Get all reviews for admin (both approved and pending) with product info
const getAllReviewsForAdmin = async (req, res) => {
  try {
    const reviews = await ProductReview.find().sort({ createdAt: -1 }).lean();

    const productIds = [
      ...new Set(
        reviews
          .map((item) => item.productId)
          .filter((id) => typeof id === "string" && id.trim() !== ""),
      ),
    ];

    const products = await Product.find({ _id: { $in: productIds } })
      .select("image title")
      .lean();

    const productMap = {};
    products.forEach((product) => {
      productMap[product._id.toString()] = {
        image: product.image,
        title: product.title,
      };
    });

    const enrichedReviews = reviews.map((review) => ({
      ...review,
      product: productMap[review.productId] || null,
    }));

    return res.status(200).json({
      success: true,
      data: enrichedReviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// Approve / unapprove a review and update product average based on approved reviews only
const updateReviewApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const review = await ProductReview.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.isApproved = !!isApproved;
    await review.save();

    // Recalculate product average rating from approved reviews only
    const approvedReviews = await ProductReview.find({
      productId: review.productId,
      isApproved: true,
    });

    const totalReviewsLength = approvedReviews.length;
    const averageReview =
      totalReviewsLength > 0
        ? approvedReviews.reduce(
            (sum, reviewItem) => sum + (reviewItem.reviewValue || 0),
            0,
          ) / totalReviewsLength
        : 0;

    await Product.findByIdAndUpdate(review.productId, { averageReview });

    return res.status(200).json({
      success: true,
      message: "Review status updated successfully",
      data: review,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update review status",
    });
  }
};

// Delete a review and update product average based on remaining approved reviews
const deleteReviewForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await ProductReview.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const productId = review.productId;

    await ProductReview.findByIdAndDelete(id);

    const approvedReviews = await ProductReview.find({
      productId,
      isApproved: true,
    });

    const totalReviewsLength = approvedReviews.length;
    const averageReview =
      totalReviewsLength > 0
        ? approvedReviews.reduce(
            (sum, reviewItem) => sum + (reviewItem.reviewValue || 0),
            0,
          ) / totalReviewsLength
        : 0;

    await Product.findByIdAndUpdate(productId, { averageReview });

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};

module.exports = {
  getAllReviewsForAdmin,
  updateReviewApprovalStatus,
  deleteReviewForAdmin,
};
