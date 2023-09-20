const express = require("express");
const router = express.Router();
const { validateToken } = require("../../../middleware/token/adminJWT");

const adminloginController = require("../../../controller/admin/auth/adminLoginController");
const passwordRecoveryController = require("../../../controller/admin/auth/passwordRecovery/passwordRecoveryController");
const adminRegistrationController = require("../../../controller/admin/auth/registrationController");
const passwordChangeController = require("../../../controller/admin/auth/passwordChangeController");

// login method
router.post("/login", adminloginController.login);

// registration method
router.post("/registration", adminRegistrationController.createAdmin);

// change password method
router.put(
  "/reset-password/:id",
  validateToken,
  passwordChangeController.changePassword
);

// Route to send email
router.post("/password-recovery", async (req, res) => {
  try {
    const info = await passwordRecoveryController.sendMail(req, res);
    res.json(info);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    res
      .status(500)
      .json({ error: "An error occurred while sending the email." });
  }
});

module.exports = router;
