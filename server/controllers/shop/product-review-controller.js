const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const { imageUploadUtil } = require("../../helpers/cloudinary");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body;

    console.log("[addProductReview] incoming body:", { productId, userId, userName, reviewMessage, reviewValue });
    console.log("[addProductReview] received files length:", req.files ? req.files.length : 0);

    const checkExistinfReview = await ProductReview.findOne({ productId, userId });

    if (checkExistinfReview) {
      return res.status(400).json({ success: false, message: "You already reviewed this product!" });
    }

    // If files were uploaded via multer (req.files), upload them to Cloudinary
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const b64 = Buffer.from(file.buffer).toString("base64");
          const url = `data:${file.mimetype};base64,${b64}`;
          const result = await imageUploadUtil(url);
          if (result && result.secure_url) uploadedImages.push(result.secure_url);
        } catch (uploadErr) {
          console.log("Failed uploading review image:", uploadErr);
        }
      }
      console.log("[addProductReview] uploadedImages:", uploadedImages);
    }

    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
      images: uploadedImages,
    });

    await newReview.save();

    res.status(201).json({ success: true, data: newReview });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ProductReview.find({
      productId,
      isApproved: true,
    }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addProductReview, getProductReviews };
