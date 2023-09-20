const bcrypt = require("bcrypt");
var CryptoJS = require("crypto-js");
const { sequelize, Model } = require("../../../db");
const Sequelize = require("sequelize");

require("dotenv").config();
const { createTokens } = require("../../../middleware/token/adminJWT");
const Admin = require("../../../models/admins");

const login = async (req, res) => {
  const my_secret_key = process.env.MY_SECRET_KEY;
  // console.log(my_secret_key)

  const { email, password } = req.body;

  try {
    // Find the admin based on the provided email
    const admin = await Admin.findOne({
      where: { email: email },
      attributes: ["name", "admin_id", "email", "password", "user_id"],
    });

    if (!admin) {
      return res.status(400).json({
        code: 400,
        error: "Admin doesn't exist",
      });
    }

    const findStatus = "SELECT active from admins where email = :email";
    const checkActiveStatus = await sequelize.query(findStatus, {
      replacements: { email },
      type: Sequelize.QueryTypes.SELECT,
    });

    if (
      checkActiveStatus[0].active === "pending" ||
      checkActiveStatus[0].active === "no"
    ) {
      res.status(403).json({ error: "Admin is in inactive list" });
    } else {
      var bytes = CryptoJS.AES.decrypt(password, my_secret_key);
      var decryptedPassword = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      // Compare the decrypted password with the stored hashed password
      const passwordMatch = await bcrypt.compare(
        decryptedPassword,
        admin.password
      );

      if (passwordMatch) {
        const accessToken = createTokens(email, password);

        // Assuming you want to store the token in a cookie
        res.cookie("access-token", accessToken, {
          maxAge: 60 * 60 * 1000, // Set the cookie expiration time to 1 hour
          httpOnly: true,
        });

        // Set the Authorization header
        res.setHeader("Authorization", `Bearer ${accessToken}`);

        res.status(200).json({
          code: 200,
          data: {
            user_id: admin.user_id,
            name: admin.name,
            email: admin.email,
            admin_id: admin.admin_id,
            message: "ADMIN LOGGED IN",
            token: accessToken,
          },
        });
      } else {
        res.status(400).json({
          code: 400,
          error: "Email and password don't match!",
        });
      }
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      code: 500,
      error: "Internal Server Error",
    });
  }
};

module.exports = { login };
