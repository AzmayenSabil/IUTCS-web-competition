const moment = require("moment");
const { sequelize, Model } = require("../../../db");
const Sequelize = require("sequelize");
const { Op, literal } = require("sequelize");

const Setting = require("../../../models/settings");
const Menu = require("../../../models/menus");
const Admin = require("../../../models/admins");

// Get all settings
const getSetting = async (req, res) => {
  try {
    const settings = await Setting.findAll();
    res.json({ code: 200, data: settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ code: 500, message: "Failed to fetch settings" });
  }
};

const updateMenus = async (mealType) => {
  try {
    // console.log("Mealtye ", mealType);
    const settings = await Setting.findAll();

    const mealTypeSetting = settings.find(
      (setting) => setting.name === mealType
    );
    // console.log("value ", mealTypeSetting.value);

    const ignoreFor = ["BreakfastNotification", "LunchNotification"];

    if (mealTypeSetting && !ignoreFor.includes(mealType)) {
      const { value } = mealTypeSetting;
      const [hour, minuteA] = value.split(":");
      const [minute, temp] = minuteA.split(" ");

      const formattedTime = `${hour}:${minute}:00`;

      //const currentDate = new Date();
      // currentDate.setDate(currentDate.getDate() + 0);

      const query =
        "UPDATE menus " +
        "SET date = DATE_FORMAT(date, '%Y-%m-%d " +
        formattedTime +
        "') " +
        "WHERE meal_type = :mealType " +
        "AND date > DATE_FORMAT(curdate(), '%Y-%m-%d')";

      const result = await sequelize.query(query, {
        replacements: { mealType },
        type: sequelize.QueryTypes.UPDATE,
      });

      // console.log(`Menus with meal type '${mealType}' updated successfully`);
      // console.log("Number of menus updated:", result[0]);
    } else {
      // console.log(`Meal type '${mealType}' not found in settings`);
    }
  } catch (error) {
    console.error("Error updating menus:", error);
  }
};

// Create or update a setting
const createSetting = async (req, res) => {
  const { name, value } = req.body;

  try {
    const setting = await Setting.findOne({ where: { name } });

    if (setting) {
      await Setting.update({ value }, { where: { name } });
    } else {
      await Setting.create({ name, value });
    }

    res.json({
      code: 200,
      // data: setting,
      data: { name, value },
      message: "Setting created or updated successfully",
    });

    updateMenus(name);
  } catch (error) {
    console.error("Error creating or updating setting:", error);
    res
      .status(500)
      .json({ code: 500, message: "Failed to create or update setting" });
  }
};

const getEmailNotificationSetting = async (req, res) => {
  try {
    const { admin_id } = req.params;
    const admin = await Admin.findOne({ where: { user_id: admin_id } });

    if (!admin) {
      return res.status(404).json({ code: 404, error: "Admin not found" });
    }

    res.status(200).json({ code: 200, data: admin.emailNotification });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const emailNotificationChange = async (req, res) => {
  try {
    const { emailNotification } = req.body;

    // Get the admin ID from the request or session, assuming you have a way to identify the admin
    const { admin_id } = req.params;
    const admin = await Admin.findOne({ where: { user_id: admin_id } });

    if (!admin) {
      return res.status(404).json({ code: 404, error: "Admin not found" });
    }

    // Update the name if provided
    if (emailNotification) {
      admin.emailNotification = emailNotification;
    }

    const data = await admin.save();
    // console.log(data);
    // console.log(emailNotification, admin_id);
    // Respond with a success message or appropriate data
    res
      .status(200)
      .json({ message: "Email notification settings updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  getSetting,
  createSetting,
  emailNotificationChange,
  getEmailNotificationSetting,
};
