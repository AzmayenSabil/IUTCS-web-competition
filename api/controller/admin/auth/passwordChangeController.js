const Admin = require("../../../models/admins");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");

const changePassword = async (req, res) => {
  const my_secret_key = process.env.MY_SECRET_KEY;

  const id = req.params.id;
  //const id = 1;

  const { oldPassword, newPassword } = req.body;
  //console.log(id, oldPassword, newPassword)

  var bytesOld = CryptoJS.AES.decrypt(oldPassword, my_secret_key);
  var decryptedOldPassword = JSON.parse(bytesOld.toString(CryptoJS.enc.Utf8));
  var bytesNew = CryptoJS.AES.decrypt(newPassword, my_secret_key);
  var decryptedNewPassword = JSON.parse(bytesNew.toString(CryptoJS.enc.Utf8));

  try {
    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1]; // Extract the token from the authorization header
    // Decode the access token and retrieve the id and name

    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized Admin!" });
    }

    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Extract the username and id from the decoded token
    const { name } = decodedToken;

    // console.log(decryptedOldPassword);
    // console.log(admin.password);
    const isPasswordValid = await bcrypt.compare(
      decryptedOldPassword,
      admin.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid old password" });
    }

    const hashedNewPassword = await bcrypt.hash(decryptedNewPassword, 10);
    admin.password = hashedNewPassword;
    await admin.save();

    res.json({
      code: 200,
      // token: accessToken,
      data: {
        admin_id: id,
        username: name,
      },
      message: "Password reset sucessfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { changePassword };
