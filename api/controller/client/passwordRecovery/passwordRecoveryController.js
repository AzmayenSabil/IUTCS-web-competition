const nodemailer = require("nodemailer");
const newGeneratedPassword = require("./generatePassword");
require("dotenv").config();
const User = require("../../../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = async (req, res) => {
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

    const { to, subject, text } = req.body;

    // Generate new password
    // console.log(newGeneratedPassword)

    // Hash the generated password
    const hashedNewGeneratedPassword = await bcrypt.hash(
      newGeneratedPassword,
      10
    );
    // console.log(hashedNewGeneratedPassword)

    // Find the user with the matching email
    const user = await User.findOne({ where: { email: to } });
    const username = user.name;
    const user_id = user.user_id;
    const employee_id = user.employee_id;
    // Update the user's password if found
    if (user) {
      user.password = hashedNewGeneratedPassword;
      await user.save();
    } else {
      throw new Error("User not found"); // Throw an error if user is not found
    }

    let info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: to,
      subject: "Password Recovery for Portal",
      html: `<table style="background-color:#f5f5f5;width:100%;max-width:600px;margin:0 auto;font-family:Arial, sans-serif;font-size:16px;line-height:1.4;color:#333;">
      <tr>
        <td style="padding:20px;">
          <h3 style="font-weight:600;margin-bottom:20px;">
            <span style="color:rgb(0,176,224);margin-top:0">Portal</span>
          </h3>
          <p style="margin-bottom:10px;">Hello,</p>
          <p style="margin-bottom:10px;"><b>${username}</b></p>
          <p style="margin-bottom:10px;">This is your temporary password <b>${newGeneratedPassword}</b>, please login with this password and change immediately </p>
     
          <p style="text-align: center; margin-top: 50px; font-size: 12px;">Powered by &copy; DreamOnline Ltd.</p>
        </td>
      </tr>
    </table>`,
    });

    // return info;
    res.json({
      code: 200,

      data: {
        user_id: user_id,
        username: username,
        employee_id: employee_id,
        email: to,
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
