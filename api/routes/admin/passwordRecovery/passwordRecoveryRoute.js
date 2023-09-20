const express = require("express");
const router = express.Router();
const { validateToken } = require("../../../middleware/token/adminJWT");
const passwordRecoveryController = require("../../../controller/admin/auth/passwordRecovery/passwordRecoveryController");

// Route to send email
router.post("/", async (req, res) => {
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
