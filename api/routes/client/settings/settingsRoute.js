const express = require("express");
const router = express.Router();
const mealEndTimeSettingsControllers = require("../../../controller/client/settings/settingsController");
const { validateToken } = require("../../../middleware/token/clientJWT");

router.get(
  "/",
  validateToken,
  mealEndTimeSettingsControllers.getMealEndTimeSettingsData
);

module.exports = router;
