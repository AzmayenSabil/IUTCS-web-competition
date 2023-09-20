const User = require("../../../models/users");
const EmergencyContact = require("../../../models/emergencyContacts");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const { sequelize, Model } = require("../../../db");

const getProfileData = async (req, res) => {
  const queriedUserID = req.params.user_id; // Access the user_id parameter from the URL
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1]; // Extract the token from the authorization header
  // Decode the access token and retrieve the id and name

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized User!" });
  }

  try {
    const user = await User.findOne({ where: { user_id: queriedUserID } });
    const emergency_contact = await EmergencyContact.findOne({
      where: { user_id: queriedUserID },
    });
    // console.log(user)
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userProfileData = await User.findOne({
      where: { user_id: queriedUserID },
      attributes: [
        "user_id",
        "name",
        "employee_id",
        "email",
        "gender",
        "active",
        "type",
        "designation",
        "current_status",
        "end_of_contract",
        "release_date",
        "department",
        "name_in_nid",
        "g_account",
        "joining_date",
        "blood_group",
        "religion",
        "contact",
        "personal_email",
        "bank_account_name",
        "name_in_etin",
        "etin",
        "nid_number",
        "nid",
        "bank_account_number",
        "present_address",
        "permanent_address",
        "tin",
        "passport_size_photo",
        "passport",
        "tax_return_documents",
        "last_office_clearance",
        "last_office_salary_certificate",
        "ssc_certificate",
        "hsc_certificate",
        "hons_certificate",
      ],
    });
    const userEmergencyContacts = await EmergencyContact.findOne({
      where: { user_id: queriedUserID },
      attributes: ["emergency_contact_one", "emergency_contact_two"],
    });
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

    // Calculate filled fields and profile completion percentage
    let filledFieldsForUserTable = 0;
    let filledFieldsForEmergencyContactTable = 0;
    // console.log("-----");
    let index = 0;
    if (user) {
      for (const field in user.dataValues) {
        if (ignorefields.includes(field)) {
          continue;
        }
        index++;
        // console.log(index, field, ": ", user.dataValues[field]);

        if (user.dataValues[field]) {
          filledFieldsForUserTable++;
          // console.log(" inside ", index, field, ": ", user.dataValues[field]);
          // console.log(user.dataValues[field]);
        } else {
          // console.log(field, ": ", user.dataValues[field]);
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
          // console.log(field, ": ", emergency_contact.dataValues[field]);
        }
      }
    }

    // console.log(
    //   getTotalNumberOfColumnsInUserTable[0].total_columns_in_user_table,
    //   getTotalNumberOfColumnsInEmergencyContactTable[0]
    //     .total_columns_in_emergency_contact_table
    // );

    filledFieldsForEmergencyContactTable = filledFieldsForEmergencyContactTable;

    const totalField = parseInt(
      getTotalNumberOfColumnsInUserTable[0].total_columns_in_user_table +
        getTotalNumberOfColumnsInEmergencyContactTable[0]
          .total_columns_in_emergency_contact_table -
        9
    );
    // console.log(totalField);
    const profileCompletionProgressPercentage =
      ((filledFieldsForUserTable + filledFieldsForEmergencyContactTable) /
        totalField) *
      100;
    // console.log(filledFieldsForUserTable, filledFieldsForEmergencyContactTable);
    // console.log(profileCompletionProgressPercentage.toFixed(0));

    res.json({
      code: 200,
      // token: accessToken,
      data: { userProfileData: userProfileData },
      dataForEmergencyContacts: userEmergencyContacts,
      profileCompletionProgressPercentage:
        profileCompletionProgressPercentage.toFixed(0),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateProfileData = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized User!" });
  }
  const queriedUserID = req.params.user_id; // Access the user_id parameter from the URL
  const { name, status, employee_id, gender } = req.body;

  try {
    const user = await User.findOne({ where: { user_id: queriedUserID } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Check if any user with the provided employee_id exists in the database
    if (employee_id) {
      const existingUser = await User.findOne({
        where: { employee_id, user_id: { [Op.ne]: queriedUserID } },
      });
      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }
    }
    // Update the user profile data
    if (name) {
      user.name = name;
    }
    if (status) {
      user.active = status;
    }
    if (employee_id) {
      user.employee_id = employee_id;
    }
    if (gender) {
      user.gender = gender;
    }

    // console.log("Save user Check ", new Date());
    const nDate = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
    });
    // console.log("Save user Check 2 ", nDate);
    await user.save();

    res.json({
      code: 200,
      // token: accessToken,
      data: {
        username: name,
        gender: gender,
        employee_id: employee_id,
        active: status,
      },
    });
  } catch (error) {
    console.error("Error updating profile data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getProfileData, updateProfileData };
