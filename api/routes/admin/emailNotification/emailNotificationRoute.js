const express = require("express");
const router = express.Router();
const emailNotiController = require("../../../controller/admin/emailNotification/emailNotificationController");
const { validateToken } = require("../../../middleware/token/adminJWT");

// Route to get all orders
router.post(
  "/sendEmail",
  validateToken,
  emailNotiController.sendOrderViaEmailForBreakfast
);

// Route to get all orders
router.post(
  "/sendEmail",
  validateToken,
  emailNotiController.sendOrderViaEmailForLunch
);

module.exports = router;
