const User = require("../../../models/users");
const bcrypt = require("bcrypt");
var CryptoJS = require("crypto-js");
const { sequelize, Model } = require("../../../db");
const Sequelize = require("sequelize");

const {
  createTokens,
  validateToken,
} = require("../../../middleware/token/clientJWT");

const login = async (req, res) => {
  const my_secret_key = process.env.MY_SECRET_KEY;

  const { email, password } = req.body;

  var bytes = CryptoJS.AES.decrypt(password, my_secret_key);
  var decryptedPassword = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  const user = await User.findOne({ where: { email: email } });
  const findStatus = "SELECT active from users where email = :email";
  const checkActiveStatus = await sequelize.query(findStatus, {
    replacements: { email },
    type: Sequelize.QueryTypes.SELECT,
  });

  if (!user) {
    res.status(401).json({ error: "User Doesn't Exist" });
  } else {
    const dbPassword = user.password;
    bcrypt.compare(decryptedPassword, dbPassword).then((match) => {
      if (!match) {
        res
          .status(400)
          .json({ error: "Wrong Email and Password Combination!" });
      } else {
        if (
          checkActiveStatus[0].active === "pending" ||
          checkActiveStatus[0].active === "no"
        ) {
          res
            .status(403)
            .json({ error: "User is in pending or inactive list" });
        } else {
          const accessToken = createTokens(user);

          // Set the access-token in the authorization header
          res.setHeader("Authorization", `Bearer ${accessToken}`);
          // Store the access token in the browser's session storage

          res.json({
            code: 200,
            token: accessToken,
            data: {
              user_id: user.user_id,
              email: email,
              username: user.name,
            },
            message: "User logged In successfully",
          });
        }
      }
    });
  }
};

module.exports = { login };
