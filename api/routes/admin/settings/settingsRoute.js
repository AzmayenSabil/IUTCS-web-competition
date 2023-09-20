const express = require("express");
const router = express.Router();
const settingsController = require("../../../controller/admin/settings/settingsController");
const { validateToken } = require("../../../middleware/token/adminJWT");

router.get("/", validateToken, settingsController.getSetting);
router.post("/", validateToken, settingsController.createSetting);
router.post(
  "/emailNotification/:admin_id",
  validateToken,
  settingsController.emailNotificationChange
);
router.get(
  "/emailNotification/:admin_id",
  validateToken,
  settingsController.getEmailNotificationSetting
);

module.exports = router;
