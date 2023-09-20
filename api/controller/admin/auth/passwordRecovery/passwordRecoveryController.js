const nodemailer = require("nodemailer");
const newGeneratedPassword = require("./generatePassword");
require("dotenv").config();
const Admin = require("../../../../models/admins");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sendMail = async (req, res) => {
  const adminName = process.env.ADMIN_NAME;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHashedPassword = process.env.HASHED_ADMIN_PASSWORD;

  try {
    let testAccount = await nodemailer.createTestAccount();

    // connect with the SMTP
    let transporter = await nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    const { email } = req.body;

    // Generate new password

    // Hash the generated password
    const hashedNewGeneratedPassword = await bcrypt.hash(
      newGeneratedPassword,
      10
    );

    // Find the admin with the matching email
    const admin = await Admin.findOne({ where: { email: email } });
    const name = admin.name;
    const admin_id = admin.admin_id;
    // Update the admin's password if found
    if (admin) {
      admin.password = hashedNewGeneratedPassword;
      await admin.save();
    } else {
      throw new Error("Admin not found"); // Throw an error if user is not found
    }

    let info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password Recovery for Meal Time",
      html: `<table style="background-color:#f5f5f5;width:100%;max-width:600px;margin:0 auto;font-family:Arial, sans-serif;font-size:16px;line-height:1.4;color:#333;">
      <tr>
        <td style="padding:20px;">
          <h3 style="font-weight:600;margin-bottom:20px;">
            <span style="color:rgb(0,176,224);margin-top:0">Meal Time</span>
          </h3>
          <p style="margin-bottom:10px;">Hello,</p>
          <p style="margin-bottom:10px;"><b>${name}</b></p>
          <p style="margin-bottom:10px;">This is your temporary password <b>${newGeneratedPassword}</b></br></br>, please login with this password and change immediately </p>
     
          <p style="text-align: center; margin-top: 50px; font-size: 12px;">Powered by &copy; DreamOnline Ltd.</p>
        </td>
      </tr>
    </table>`,
    });

    // console.log("Message sent: %s", info.messageId);
    // return info;
    res.json({
      code: 200,
      data: {
        username: name,
        email: email,
      },
      message: "Mail Sent",
    });
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    throw error;
  }
};

module.exports = {
  sendMail,
};
