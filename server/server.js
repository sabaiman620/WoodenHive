
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// Import Routes
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const adminReviewRouter = require("./routes/admin/review-routes");
const adminSettingsRouter = require("./routes/admin/settings-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

// -------------------------------
// 🔥 MongoDB Atlas Connection
// -------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected successfully"))
  .catch((error) => {
    console.error("❌ MongoDB Atlas connection failed:", error.message);
  });

// -------------------------------
const app = express();
// app.set('trust proxy', 1);
// mongoose.set('strictQuery', false);                 for production.............................
const PORT = process.env.PORT || 5000;

// -------------------------------
// CORS
// -------------------------------
app.use(
  cors({
    origin: [
      "http://woodenhive.com",
  "https://woodenhive.com",
  "http://www.woodenhive.com",
  "https://www.woodenhive.com",
  "http://localhost:5173",
    ],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());


// HEALTH CHECK ROUTE (Fixes the "Availability Check" error)
// -------------------------------
app.get("/", (req, res) => {
  res.status(200).send("Server is healthy and running!");
});

// -------------------------------
// ROUTES
// -------------------------------
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/reviews", adminReviewRouter);
app.use("/api/admin/settings", adminSettingsRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);

// -------------------------------
app.listen(PORT, () =>
  console.log(`🚀 Server is running on http://localhost:${PORT}`),
);
