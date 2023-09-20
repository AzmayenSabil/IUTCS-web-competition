const express = require("express");
const router = express.Router();
const loginController = require("../../../controller/client/auth/loginController");
const registrationController = require("../../../controller/client/auth/registrationController");
const passwordResetController = require("../../../controller/client/auth/passwordResetController");
const passwordRecoveryController = require("../../../controller/client/passwordRecovery/passwordRecoveryController");

const { validateToken } = require("../../../middleware/token/clientJWT");
// login method
router.post("/login", loginController.login);
router.post("/registration", registrationController.createUser);
router.put(
  "/reset-password/:id",
  validateToken,
  passwordResetController.resetPassword
);
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
