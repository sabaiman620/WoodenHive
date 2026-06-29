const express = require("express");
const { getSetting, setSetting } = require("../../controllers/admin/settings-controller");

const router = express.Router();

// GET /api/admin/settings/:key
router.get("/:key", getSetting);

// PUT /api/admin/settings/:key
router.put("/:key", setSetting);

module.exports = router;
