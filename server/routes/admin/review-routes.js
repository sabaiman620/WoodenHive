const express = require("express");

const {
  getAllReviewsForAdmin,
  updateReviewApprovalStatus,
  deleteReviewForAdmin,
} = require("../../controllers/admin/review-controller");

const router = express.Router();

router.get("/get", getAllReviewsForAdmin);
router.put("/update/:id", updateReviewApprovalStatus);
router.delete("/delete/:id", deleteReviewForAdmin);

module.exports = router;
