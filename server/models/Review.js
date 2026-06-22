const mongoose = require("mongoose");

const ProductReviewSchema = new mongoose.Schema(
  {
    productId: String,
    userId: String,
    userName: String,
    reviewMessage: String,
    reviewValue: Number,
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ProductReview", ProductReviewSchema);
