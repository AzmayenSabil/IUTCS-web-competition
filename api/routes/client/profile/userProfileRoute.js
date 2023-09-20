const express = require("express");
const router = express.Router();
const userProfileController = require("../../../controller/client/profile/userProfileController");
const { validateToken } = require("../../../middleware/token/clientJWT");

router.get("/:user_id", validateToken, userProfileController.getProfileData);
// router.put("/:user_id", validateToken, userProfileController.updateProfileData)

module.exports = router;
