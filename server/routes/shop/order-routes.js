const express = require("express");

const {
  createOrder,
  getAllOrdersByUser,
  getGuestOrdersByIdAndEmail,
  getOrderDetails,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/guest/:guestId/:email", getGuestOrdersByIdAndEmail);
router.get("/details/:id", getOrderDetails);

module.exports = router;
