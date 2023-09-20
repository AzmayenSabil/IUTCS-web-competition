const User = require("../../../models/users");
const EmergencyContact = require("../../../models/emergencyContacts");

const jwt = require("jsonwebtoken");
const { sequelize, Model } = require("../../../db");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const moment = require("moment"); // Import the moment library

const completeProfileData = async (req, res) => {
  const information_schema_column_numbers = 3;

  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized Admin!" });
  }

  const userId = req.params.user_id; // Access the user_id parameter from the URL
  const updatedFields = req.body; // Fields to be updated received from the frontend
  // console.log(updatedFields);

  try {
    const user = await User.findOne({ where: { user_id: userId } });
    const emergency_contact = await EmergencyContact.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user object with the new field values
    for (const field in updatedFields) {
      // console.log(field, user[field], updatedFields[field]);
      if (updatedFields[field]) {
        user[field] = updatedFields[field];
      }
      // console.log(user[field]);
      // console.log("");
    }

    const updatedUser = await user.save();

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
    // console.log(user.dataValues)
    // Calculate filled fields and profile completion percentage
    let filledFieldsForUserTable = 0;
    let filledFieldsForEmergencyContactTable = 0;
    //  console.log("-----");
    let index = 0;
    if (user) {
      for (const field in user.dataValues) {
        if (ignorefields.includes(field)) {
          continue;
        }
        if (user.dataValues[field]) {
          filledFieldsForUserTable++;
        }
      }
    }

    filledFieldsForUserTable = filledFieldsForUserTable;

    if (emergency_contact) {
      for (const field in emergency_contact.dataValues) {
        // console.log(field, ": ", emergency_contact.dataValues[field]);
        if (ignorefields.includes(field)) {
          continue;
        }
        if (emergency_contact.dataValues[field]) {
          filledFieldsForEmergencyContactTable++;
        } else {
          //  console.log(field, ": ", emergency_contact.dataValues[field]);
        }
      }
    }

    //  console.log(
    //    getTotalNumberOfColumnsInUserTable[0].total_columns_in_user_table,
    //    getTotalNumberOfColumnsInEmergencyContactTable[0]
    //      .total_columns_in_emergency_contact_table
    //  );

    filledFieldsForEmergencyContactTable = filledFieldsForEmergencyContactTable;

    const totalField = parseInt(
      getTotalNumberOfColumnsInUserTable[0].total_columns_in_user_table +
        getTotalNumberOfColumnsInEmergencyContactTable[0]
          .total_columns_in_emergency_contact_table -
        9
    );
    //  console.log(totalField);
    const profileCompletionProgressPercentage =
      ((filledFieldsForUserTable + filledFieldsForEmergencyContactTable) /
        totalField) *
      100;

    // Return only the specified attributes in the response
    const responseData = {
      name: updatedUser.name,
      user_id: updatedUser.user_id,
      employee_id: updatedUser.employee_id,
      email: updatedUser.email,
      active: updatedUser.active,
      gender: updatedUser.gender,
      type: updatedUser.type,
      designation: updatedUser.designation,
      current_status: updatedUser.current_status,
      // end_of_contract: updatedUser.end_of_contract,
      profile_completion: {
        percentage: profileCompletionProgressPercentage.toFixed(0), // Rounded to two decimal places
      },
      end_of_contract: moment(updatedUser.end_of_contract).format("YYYY-MM-DD"),
      release_date: moment(updatedUser.release_date).format("YYYY-MM-DD"),
      gross_salary: updatedUser.gross_salary,
      department: updatedUser.department,
      g_account: updatedUser.g_account,
      joining_date: moment(updatedUser.joining_date).format("YYYY-MM-DD"),
    };

    res.json({
      code: 200,
      data: responseData,
    });
  } catch (error) {
    console.error("Error updating profile data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { completeProfileData };
