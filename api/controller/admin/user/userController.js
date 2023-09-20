const User = require("../../../models/users");
const EmergencyContact = require("../../../models/emergencyContacts");

const bcrypt = require("bcrypt");
const { getToken } = require("../../../middleware/token/adminJWT");
const { sequelize, Model } = require("../../../db");
const Sequelize = require("sequelize");
const moment = require("moment"); // Import the moment library

const {
  updateCreatedAt,
} = require("../../../utils/adminUtils/userControllerUtils");
const newGeneratedPassword = require("../auth/passwordRecovery/generatePassword");
const nodemailer = require("nodemailer");
const { response } = require("express");
require("dotenv").config();

const createUser = async (req, res) => {
  try {
    const { name, employee_id, email } = req.body;

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

    // Check if the employee ID already exists in the database
    const existingEmployee = await User.findOne({
      where: { employee_id: employee_id },
    });
    if (existingEmployee) {
      return res.status(409).json({
        code: 409,
        error: "Employee ID already exists",
      });
    }

    // Check if the email already exists in the database
    const existingEmail = await User.findOne({ where: { email: email } });
    if (existingEmail) {
      return res.status(409).json({ code: 409, error: "Email already exists" });
    }

    // const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

    const data = await User.create({
      name: name,
      employee_id: employee_id,
      email: email,
      active: "yes",
      password: hashedNewGeneratedPassword,
    });

    // Manually update the createdAt timestamp
    // await updateCreatedAt(data);

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
      data: data,
      message: "New user added successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ code: 400, error: error.message });
  }
};

const getAllUser = async (req, res) => {
  const information_schema_column_numbers = 3;

  try {
    const users = await User.findAll();

    const QueryForFindingTotalNumberOfColumnsInUserTable = `
    SELECT COUNT(*) AS total_columns_in_user_table
    FROM information_schema.columns
    WHERE table_schema = 'meal_time'
      AND table_name = 'users';
    `;
    const QueryForFindingTotalNumberOfColumnsInEmergencyContactTable = `
    SELECT COUNT(*) AS total_columns_in_emergency_contact_table
    FROM information_schema.columns
    WHERE table_schema = 'meal_time'
      AND table_name = 'emergencycontacts';
    `;

    const getTotalNumberOfColumnsInUserTable = await sequelize.query(
      QueryForFindingTotalNumberOfColumnsInUserTable,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const getTotalNumberOfColumnsInEmergencyContactTable =
      await sequelize.query(
        QueryForFindingTotalNumberOfColumnsInEmergencyContactTable,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );

    let ignorefields = [
      "role",
      "user_id",
      "createdAt",
      "updatedAt",
      "password",
      "id",
    ];

    // console.log(users[0].dataValues);
    // console.log(
    //   getTotalNumberOfColumnsInUserTable[0].total_columns_in_user_table
    // );
    // console.log(
    //   getTotalNumberOfColumnsInEmergencyContactTable[0]
    //     .total_columns_in_emergency_contact_table
    // );

    // const usersWithFormattedData = users.map((user) => {
    //   // let filledFields = 0;
    //   // Calculate filled fields and profile completion percentage
    //   let filledFieldsForUserTable = 0;
    //   let filledFieldsForEmergencyContactTable = 0;

    //   const emergency_contact = EmergencyContact.findOne({
    //     where: { user_id: user.user_id },
    //   });

    //   // console.log(user.dataValues);
    //   let i = 0;
    //   for (const field in user.dataValues) {
    //     // console.log(field + ": " + user.dataValues[field]);
    //     if (ignorefields.includes(field)) {
    //       continue;
    //     }
    //     if (user.dataValues[field]) {
    //       filledFieldsForUserTable++;
    //     }
    //     // console.log(i++);
    //   }

    //   console.log("--", emergency_contact.dataValues);

    //   if (emergency_contact) {
    //     for (const field in emergency_contact.dataValues) {
    //       // console.log(field + ": " + emergency_contact.dataValues[field]);

    //       if (ignorefields.includes(field)) {
    //         continue;
    //       }
    //       if (emergency_contact.dataValues[field]) {
    //         filledFieldsForEmergencyContactTable++;
    //       }
    //     }
    //   }

    //   // const profileCompletionPercentage = (filledFields / totalFields) * 100;
    //   const totalField = parseInt(
    //     getTotalNumberOfColumnsInUserTable[0].total_columns_in_user_table +
    //       getTotalNumberOfColumnsInEmergencyContactTable[0]
    //         .total_columns_in_emergency_contact_table -
    //       9
    //   );

    //   const profileCompletionProgressPercentage =
    //     ((filledFieldsForUserTable + filledFieldsForEmergencyContactTable) /
    //       totalField) *
    //     100;

    //   const responseData = {
    //     name: user.name,
    //     user_id: user.user_id,
    //     employee_id: user.employee_id,
    //     email: user.email,
    //     active: user.active,
    //     gender: user.gender,
    //     type: user.type,
    //     designation: user.designation,
    //     current_status: user.current_status,
    //     profile_completion: {
    //       percentage: profileCompletionProgressPercentage.toFixed(0),
    //     },
    //     end_of_contract: moment(user.end_of_contract).format("YYYY-MM-DD"),
    //     release_date: moment(user.release_date).format("YYYY-MM-DD"),
    //     gross_salary: user.gross_salary,
    //     department: user.department,
    //     g_account: user.g_account,
    //     joining_date: moment(user.joining_date).format("YYYY-MM-DD"),
    //   };
    //   // console.log(responseData)
    //   return responseData;
    // });

    // res.status(200).json({ code: 200, data: usersWithFormattedData });
    const usersWithFormattedData = users.map(async (user) => {
      // Calculate filled fields and profile completion percentage
      let filledFieldsForUserTable = 0;
      let filledFieldsForEmergencyContactTable = 0;

      // Use await inside an async function to fetch emergency_contact
      const emergency_contact = await EmergencyContact.findOne({
        where: { user_id: user.user_id },
      });

      // Count filled fields in the user table
      for (const field in user.dataValues) {
        if (ignorefields.includes(field)) {
          continue;
        }
        if (user.dataValues[field]) {
          filledFieldsForUserTable++;
        }
      }

      // Check if emergency_contact exists before processing
      if (emergency_contact) {
        for (const field in emergency_contact.dataValues) {
          if (ignorefields.includes(field)) {
            continue;
          }
          if (emergency_contact.dataValues[field]) {
            filledFieldsForEmergencyContactTable++;
          }
        }
      }

      // Calculate the total number of fields (excluding ignored fields)
      const totalField = parseInt(
        getTotalNumberOfColumnsInUserTable[0].total_columns_in_user_table +
          getTotalNumberOfColumnsInEmergencyContactTable[0]
            .total_columns_in_emergency_contact_table -
          9
      );

      // Calculate the profile completion progress percentage
      const profileCompletionProgressPercentage =
        ((filledFieldsForUserTable + filledFieldsForEmergencyContactTable) /
          totalField) *
        100;

      const responseData = {
        name: user.name,
        user_id: user.user_id,
        employee_id: user.employee_id,
        email: user.email,
        active: user.active,
        gender: user.gender,
        type: user.type,
        designation: user.designation,
        current_status: user.current_status,
        profile_completion: {
          percentage: profileCompletionProgressPercentage.toFixed(0),
        },
        end_of_contract: moment(user.end_of_contract).format("YYYY-MM-DD"),
        release_date: moment(user.release_date).format("YYYY-MM-DD"),
        gross_salary: user.gross_salary,
        department: user.department,
        g_account: user.g_account,
        joining_date: moment(user.joining_date).format("YYYY-MM-DD"),
      };
      // console.log(responseData)
      return responseData;
    });

    // Use Promise.all to await the results of the map operation
    Promise.all(usersWithFormattedData)
      .then((formattedUsers) => {
        res.status(200).json({ code: 200, data: formattedUsers });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).json({ code: 500, error: "Internal Server Error" });
      });
  } catch (error) {
    console.error(error);
    res.status(400).json({ code: 400, error: error.message });
  }
};

// const getAllUser = async (req, res) => {
//   const information_schema_column_numbers = 3;

//   try {
//     // const users = await User.findAll({
//     //   attributes: [
//     //     "name",
//     //     "user_id",
//     //     "employee_id",
//     //     "email",
//     //     "active",
//     //     "gender",
//     //     "type",
//     //     "designation",
//     //     "current_status",
//     //     "end_of_contract",
//     //     "release_date",
//     //     "gross_salary",
//     //     "department",
//     //     "g_account",
//     //     "joining_date",
//     //   ],
//     // });
//     const users = await User.findAll();

//     // Count the number of columns in the table
//     const columnCountQuery = `
//       SELECT count(*) AS number_of_columns
//       FROM information_schema.columns
//       WHERE table_name = 'users';`;

//     const [columnCountResult] = await sequelize.query(columnCountQuery);
//     // console.log(columnCountResult)
//     const totalFields = columnCountResult[0].number_of_columns - information_schema_column_numbers;

//     const usersWithProfileCompletion = users.map((user) => {
//       // const totalFields = Object.keys(user.dataValues).length;
//       let filledFields = 0;
//       console.log(user.dataValues)
//       for (const field in user.dataValues) {
//         // console.log(user.dataValues[field])
//         if (user.dataValues[field] !== null && user.dataValues[field] !== "") {
//           filledFields++;
//         }
//       }

//       const profileCompletionPercentage = (filledFields / totalFields) * 100;

//       return {
//         ...user.dataValues,
//         profile_completion: {
//           percentage: profileCompletionPercentage.toFixed(0), // Rounded to two decimal places
//         },
//       };
//     });

//     res.status(200).json({ code: 200, data: usersWithProfileCompletion });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ code: 400, error: error.message });
//   }
// };

const updateUser = async (req, res) => {
  const userId = req.params.user_id;
  const { name, employee_id } = req.body;

  const accessToken = getToken(req, res);

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ code: 404, error: "User not found" });
    }
    // Update the user's name if provided
    if (name) {
      user.name = name;
    }
    // Update the user's employee ID if provided
    if (employee_id) {
      user.employee_id = employee_id;
    }

    const data = await user.save();

    res.header("access-token", accessToken).json({
      code: 200,
      data: user,
      message: "User updated successfully",
      token: accessToken,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ code: 500, error: "Internal server error" });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { active } = req.body;

    // Find the user by ID
    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ code: 404, error: "User not found" });
    }

    // Update the user status
    user.active = active;
    if (active == "yes") {
      user.current_status = "Active";
    } else {
      user.current_status = "Pending";
    }
    await user.save();

    res
      .status(200)
      .json({ code: 200, message: "User status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ code: 400, error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    // connect with the SMTP
    let transporter = await nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    const { user_id } = req.params;
    const { email } = req.body;

    // Find the user by ID
    const user = await User.findByPk(user_id);

    // Generate new password
    // Hash the generated password
    const hashedNewGeneratedPassword = await bcrypt.hash(
      newGeneratedPassword,
      10
    );

    // Find the user with the matching email
    // Update the user's password if found
    // Update the user's password with the hashed generated password
    user.password = hashedNewGeneratedPassword;
    await user.save();

    let info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password change for Meal Time",
      html: `<table style="background-color:#f5f5f5;width:100%;max-width:600px;margin:0 auto;font-family:Arial, sans-serif;font-size:16px;line-height:1.4;color:#333;">
      <tr>
        <td style="padding:20px;">
          <h3 style="font-weight:600;margin-bottom:20px;">
            <span style="color:rgb(0,176,224);margin-top:0">Meal Time</span>
          </h3>
          <p style="margin-bottom:10px;">Hello,</p>
          <p style="margin-bottom:10px;"><b>${user.name}</b></p>
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
        username: user.name,
        email: email,
      },
      message: "Mail Sent",
    });
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    throw error;
  }
};

const addPendingUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Find the user with the given userId and update its status to "yes"
    const [updatedRowCount] = await User.update(
      { active: "yes" },
      { where: { user_id: user_id, active: "pending" } }
    );

    if (updatedRowCount === 0) {
      return res
        .status(404)
        .json({ code: 404, error: "User not found or already active" });
    }

    res
      .status(200)
      .json({ code: 200, message: "User status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, error: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Delete the user based on the user_id
    const deletedUser = await User.destroy({
      where: {
        user_id: user_id,
      },
    });

    if (deletedUser) {
      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } else {
      res.status(404).json({ success: false, error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to delete user" });
  }
};

module.exports = {
  createUser,
  getAllUser,
  updateUser,
  // getUserInfo,
  updateUserStatus,
  changePassword,
  addPendingUser,
  deleteUser,
};
