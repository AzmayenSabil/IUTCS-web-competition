const Admin = require("../../../models/admins");
const bcrypt = require("bcrypt");
var CryptoJS = require("crypto-js");

const { Op } = require("sequelize");

const createAdmin = async (req, res) => {
  try {
    const { name, admin_id, email, gender, password } = req.body;

    // var bytes = CryptoJS.AES.decrypt(password, "my-secret-key@123");
    // var decryptedPassword = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    // Check if a user with the same email or employee ID already exists
    const existingAdmin = await Admin.findOne({
      where: {
        [Op.or]: [{ email: email }, { admin_id: admin_id }],
      },
    });

    if (existingAdmin) {
      res.status(409).json({ message: "Admin already exists" });
    } else {
      // const hashedPassword = await bcrypt.hash(decryptedPassword, 10);
      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = await Admin.create({
        name: name,
        admin_id: admin_id,
        email: email,
        active: "yes",
        isSuperAdmin: "no",
        gender: gender,
        password: hashedPassword,
      });

      res.json({
        code: 200,
        data: {
          id: newAdmin.id,
          name: newAdmin.name,
          admin_id: newAdmin.admin_id,
          email: newAdmin.email,
          gender: newAdmin.gender,
          isSuperAdmin: newAdmin.isSuperAdmin,
        },
        message: "Admin registered successfully",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createAdmin };
