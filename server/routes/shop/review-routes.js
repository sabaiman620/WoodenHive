const express = require("express");

const {
  addProductReview,
  getProductReviews,
} = require("../../controllers/shop/product-review-controller");
const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

router.post("/add", upload.array("images"), addProductReview);
router.get("/:productId", getProductReviews);

module.exports = router;
