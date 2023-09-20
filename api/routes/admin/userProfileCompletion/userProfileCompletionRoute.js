const express = require("express");
const router = express.Router();
const profileCompletionController = require("../../../controller/admin/userProfileCompletion/userProfileCompletionController");
const { validateToken } = require("../../../middleware/token/clientJWT");

// Routes for users profile completion
router.post(
  "/:user_id",
  validateToken,
  profileCompletionController.completeProfileData
);

module.exports = router;
