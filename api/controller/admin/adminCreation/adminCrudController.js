const Admin = require("../../../models/admins");
const bcrypt = require("bcrypt");
const { getToken } = require("../../../middleware/token/adminJWT");

const { Op } = require("sequelize");

const newGeneratedPassword = require("../auth/passwordRecovery/generatePassword");
const nodemailer = require("nodemailer");
require("dotenv").config();

const createAdmin = async (req, res) => {
  try {
    const { name, admin_id, email, gender } = req.body;

    // var bytes = CryptoJS.AES.decrypt(password, "my-secret-key@123");
    // var decryptedPassword = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    const accessToken = getToken(req, res);

    let transporter = await nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    // Hash the generated password
    const hashedNewGeneratedPassword = await bcrypt.hash(
      newGeneratedPassword,
      10
    );

    const existingAdmin = await Admin.findOne({
      where: {
        [Op.or]: [{ email: email }, { admin_id: admin_id }],
      },
    });

    let newAdmin;

    if (existingAdmin) {
      res.status(409).json({ message: "Admin already exists" });
    } else {
      // const hashedPassword = await bcrypt.hash(decryptedPassword, 10);
      //const hashedPassword = await bcrypt.hash(password, 10);

      newAdmin = await Admin.create({
        name: name,
        admin_id: admin_id,
        email: email,
        active: "yes",
        isSuperAdmin: "no",
        password: hashedNewGeneratedPassword,
        emailNotification: "yes",
        active: "yes",
        isSuperAdmin: "no",
        password: hashedNewGeneratedPassword,
        // emailNotification: "yes"
      });
    }

    let info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "MealTime account Creation",
      html: `<table style="background-color:#f5f5f5;width:100%;max-width:600px;margin:0 auto;font-family:Arial, sans-serif;font-size:16px;line-height:1.4;color:#333;">
      <tr>
        <td style="padding:20px;">
          <h3 style="font-weight:600;margin-bottom:20px;">
            <span style="color:rgb(0,176,224);margin-top:0">Meal Time</span>
          </h3>
          <p style="margin-bottom:10px;">Hello,</p>
          <p style="margin-bottom:10px;"><b>${name}</b></p>
          <p style="margin-bottom:10px;">This is a temporary password for your account <b>${newGeneratedPassword}</b>, please login with this password and change immediately </p>
     
          <p style="text-align: center; margin-top: 50px; font-size: 12px;">Powered by &copy; DreamOnline Ltd.</p>
        </td>
      </tr>
    </table>`,
    });

    res.status(200).json({
      code: 200,
      data: {
        id: newAdmin.user_id,
        user_id: newAdmin.user_id,
        name: newAdmin.name,
        admin_id: newAdmin.admin_id,
        email: newAdmin.email,
        active: newAdmin.active,
        gender: newAdmin.gender,
        isSuperAdmin: newAdmin.isSuperAdmin,
      },
      message: "Admin registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ code: 400, error: error.message });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: ["name", "user_id", "admin_id", "email", "active", "gender"],
    });

    res.status(200).json({ code: 200, data: admins });
  } catch (error) {
    console.error(error);
    res.status(400).json({ code: 400, error: error.message });
  }
};

const getAdmin = async (req, res) => {
  const userId = req.params.user_id;

  try {
    const admin = await Admin.findOne({
      where: { user_id: userId },
      attributes: [
        "name",
        "user_id",
        "admin_id",
        "email",
        "active",
        "gender",
        "isSuperAdmin",
      ],
    });
    // console.log(admin);

    if (!admin) {
      return res.status(404).json({ code: 404, message: "Admin not found" });
    }

    res.status(200).json({ code: 200, data: admin });
  } catch (error) {
    console.error(error);
    res.status(400).json({ code: 400, error: error.message });
  }
};

const updateAdmin = async (req, res) => {
  const userId = req.params.user_id;
  // console.log("running")
  const { name, email, admin_id, gender } = req.body;
  // console.log(req.body);
  const accessToken = getToken(req, res);

  try {
    const admin = await Admin.findOne({ where: { user_id: userId } });

    if (!admin) {
      return res.status(404).json({ code: 404, error: "Admin not found" });
    }

    // Update the name if provided
    if (name) {
      admin.name = name;
    }

    // Update the admins ID if provided
    if (admin_id) {
      admin.admin_id = admin_id;
    }

    // Update the email ID if provided
    if (email) {
      admin.email = email;
    }

    // Update the gender if provided
    if (gender) {
      admin.gender = gender;
    }

    const data = await admin.save();
    // console.log(data);

    res.header("access-token", accessToken).json({
      code: 200,
      data: admin,
      message: "Admin updated successfully",
      token: accessToken,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ code: 500, error: "Internal server error" });
  }
};

const updateAdminStatus = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { active } = req.body;

    // Find the user by ID
    const admin = await Admin.findOne({
      where: { user_id: user_id },
    });

    if (!admin) {
      return res.status(404).json({ code: 404, error: "Admin not found" });
    }

    // Update the user status
    admin.active = active;
    await admin.save();

    res
      .status(200)
      .json({ code: 200, message: "Admin status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ code: 400, error: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Delete the user based on the user_id
    const deletedAdmin = await Admin.destroy({
      where: {
        user_id: user_id,
      },
    });

    if (deletedAdmin) {
      res
        .status(200)
        .json({ success: true, message: "Admin deleted successfully" });
    } else {
      res.status(404).json({ success: false, error: "Admin not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to delete Admin" });
  }
};

module.exports = {
  createAdmin,
  getAllAdmin,
  getAdmin,
  updateAdmin,
  updateAdminStatus,
  deleteAdmin,
};
