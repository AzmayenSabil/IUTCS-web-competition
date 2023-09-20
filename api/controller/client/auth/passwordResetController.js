const User = require("../../../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");

const resetPassword = async (req, res) => {
  const my_secret_key = process.env.MY_SECRET_KEY;

  const id = req.params.id;
  //const id = 1;

  const { oldPassword, newPassword } = req.body;

  var bytesOld = CryptoJS.AES.decrypt(oldPassword, my_secret_key);
  var decryptedOldPassword = JSON.parse(bytesOld.toString(CryptoJS.enc.Utf8));
  var bytesNew = CryptoJS.AES.decrypt(newPassword, my_secret_key);
  var decryptedNewPassword = JSON.parse(bytesNew.toString(CryptoJS.enc.Utf8));

  try {
    const user = await User.findByPk(id);
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1]; // Extract the token from the authorization header
    // Decode the access token and retrieve the id and name

    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized User!" });
    }

    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized User!" });
    }

    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Extract the username and id from the decoded token
    const { name } = decodedToken;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      decryptedOldPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid old password" });
    }

    const hashedNewPassword = await bcrypt.hash(decryptedNewPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({
      code: 200,
      // token: accessToken,
      data: {
        user_id: id,
        username: name,
      },
      message: "Password reset sucessfull",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { resetPassword };
