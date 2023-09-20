const User = require("../../../models/users");
const jwt = require("jsonwebtoken");
const EmergencyContact = require("../../../models/emergencyContacts");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const { sequelize, Model } = require("../../../db");

let ignorefields = [
  "role",
  "user_id",
  "createdAt",
  "updatedAt",
  "password",
  "id",
];

const basicInformationCompletion = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized User!" });
  }
  const queriedUserID = req.params.user_id; // Access the user_id parameter from the URL
  const { name, gender } = req.body;

  try {
    const user = await User.findOne({ where: { user_id: queriedUserID } });
    const emergency_contact = await EmergencyContact.findOne({
      where: { user_id: queriedUserID },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Check if any user with the provided employee_id exists in the database

    // Update the user profile data
    if (name === "" || name) {
      user.name = name;
    }

    if (gender === "" || gender) {
      user.gender = gender;
    }
    await user.save();

    // Check if the user has existing emergency contact entry

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

    // Calculate filled fields and profile completion percentage
    let filledFieldsForUserTable = 0;
    let filledFieldsForEmergencyContactTable = 0;
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
        if (ignorefields.includes(field)) {
          continue;
        }
        if (emergency_contact.dataValues[field]) {
          filledFieldsForEmergencyContactTable++;
        }
      }
    }

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
      data: {
        user_id: queriedUserID,
        username: name,
        gender: gender,
        profileCompletionProgressPercentage:
          profileCompletionProgressPercentage.toFixed(0),
      },
    });
  } catch (error) {
    console.error("Basic Information updating data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const generalInformationCompletion = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized User!" });
  }
  const queriedUserID = req.params.user_id; // Access the user_id parameter from the URL
  const { name_in_nid, religion, blood_group, personal_email, contact } =
    req.body;

  // console.log(req.body);

  const emergency_contact = await EmergencyContact.findOne({
    where: { user_id: queriedUserID },
  });

  try {
    const user = await User.findOne({ where: { user_id: queriedUserID } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Check if any user with the provided employee_id exists in the database

    // Update the user profile data
    if (name_in_nid === "" || name_in_nid) {
      user.name_in_nid = name_in_nid;
    }
    if (religion === "" || religion) {
      user.religion = religion;
    }
    if (blood_group === "" || blood_group) {
      user.blood_group = blood_group;
    }
    if (personal_email === "" || personal_email) {
      user.personal_email = personal_email;
    }
    if (contact === "" || contact) {
      user.contact = contact;
    }

    await user.save();

    // Check if the user has existing emergency contact entry

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

    // Calculate filled fields and profile completion percentage
    let filledFieldsForUserTable = 0;
    let filledFieldsForEmergencyContactTable = 0;
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
        if (ignorefields.includes(field)) {
          continue;
        }
        if (emergency_contact.dataValues[field]) {
          filledFieldsForEmergencyContactTable++;
        }
      }
    }

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
      data: {
        user_id: queriedUserID,
        name_in_nid: name_in_nid,
        religion: religion,
        blood_group: blood_group,
        personal_email: personal_email,
        contact: contact,
        profileCompletionProgressPercentage:
          profileCompletionProgressPercentage.toFixed(0),
      },
    });
  } catch (error) {
    console.error("General Information updating data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const confidentialInformationCompletion = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized User!" });
  }
  const queriedUserID = req.params.user_id; // Access the user_id parameter from the URL
  const {
    nid_number,
    bank_account_number,
    bank_account_name,
    etin,
    name_in_etin,
    present_address,
    permanent_address,
  } = req.body;
  // console.log(req.body);

  try {
    const user = await User.findOne({ where: { user_id: queriedUserID } });
    const emergency_contact = await EmergencyContact.findOne({
      where: { user_id: queriedUserID },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Check if any user with the provided employee_id exists in the database

    // Update the user profile data
    if (nid_number === "" || nid_number) {
      user.nid_number = nid_number;
    }

    if (bank_account_number === "" || bank_account_number) {
      user.bank_account_number = bank_account_number;
    }

    if (bank_account_name === "" || bank_account_name) {
      user.bank_account_name = bank_account_name;
    }

    if (etin === "" || etin) {
      user.etin = etin;
    }

    if (name_in_etin === "" || name_in_etin) {
      user.name_in_etin = name_in_etin;
    }

    if (present_address === "" || present_address) {
      user.present_address = present_address;
    }

    if (permanent_address === "" || permanent_address) {
      user.permanent_address = permanent_address;
    }

    await user.save();
    // Check if the user has existing emergency contact entry

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

    // Calculate filled fields and profile completion percentage
    let filledFieldsForUserTable = 0;
    let filledFieldsForEmergencyContactTable = 0;
    if (user) {
      for (const field in user.dataValues) {
        // console.log(user.dataValues[field]);
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
        // console.log(emergency_contact.dataValues[field]);
        if (ignorefields.includes(field)) {
          continue;
        }
        if (emergency_contact.dataValues[field]) {
          filledFieldsForEmergencyContactTable++;
        }
      }
    }

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
      data: {
        user_id: queriedUserID,
        nid_number: nid_number,
        bank_account_number: bank_account_number,
        bank_account_name: bank_account_name,
        etin: etin,
        name_in_etin: name_in_etin,
        present_address: present_address,
        permanent_address: permanent_address,
        profileCompletionProgressPercentage:
          profileCompletionProgressPercentage.toFixed(0),
      },
    });
  } catch (error) {
    console.error("Confidential Information updating data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const emergencyContactInformation = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized User!" });
  }
  const queriedUserID = req.params.user_id; // Access the user_id parameter from the URL

  const { emergency_contact_one, emergency_contact_two } = req.body;

  try {
    const user = await User.findOne({ where: { user_id: queriedUserID } });
    const emergency_contact = await EmergencyContact.findOne({
      where: { user_id: queriedUserID },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user has existing emergency contact entry
    let emergencyContact = await EmergencyContact.findOne({
      where: { user_id: queriedUserID },
    });

    if (!emergencyContact) {
      // Create a new entry in EmergencyContact table
      emergencyContact = await EmergencyContact.create({
        user_id: queriedUserID,
        emergency_contact_one: emergency_contact_one,
        emergency_contact_two: emergency_contact_two,
      });
    } else {
      // Update the existing entry
      emergencyContact.emergency_contact_one = emergency_contact_one;
      emergencyContact.emergency_contact_two = emergency_contact_two;
      await emergencyContact.save();
    }

    // Check if the user has existing emergency contact entry

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

    // Calculate filled fields and profile completion percentage
    let filledFieldsForUserTable = 0;
    let filledFieldsForEmergencyContactTable = 0;
    if (user) {
      for (const field in user.dataValues) {
        // console.log(user.dataValues[field]);
        if (ignorefields.includes(field)) {
          continue;
        }
        if (user.dataValues[field]) {
          filledFieldsForUserTable++;
        }
      }
    }

    filledFieldsForUserTable = filledFieldsForUserTable - 5;

    if (emergency_contact) {
      for (const field in emergency_contact.dataValues) {
        // console.log(emergency_contact.dataValues[field]);
        if (ignorefields.includes(field)) {
          continue;
        }
        if (emergency_contact.dataValues[field]) {
          filledFieldsForEmergencyContactTable++;
        }
      }
    }

    filledFieldsForEmergencyContactTable =
      filledFieldsForEmergencyContactTable - 4;

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
      data: {
        user_id: queriedUserID,
        emergency_contact_one: emergency_contact_one,
        emergency_contact_two: emergency_contact_two,
        profileCompletionProgressPercentage:
          profileCompletionProgressPercentage.toFixed(0),
      },
    });
  } catch (error) {
    console.error("Emergency Contact Information updating data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  basicInformationCompletion,
  generalInformationCompletion,
  confidentialInformationCompletion,
  emergencyContactInformation,
};
