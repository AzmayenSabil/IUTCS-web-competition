const jwt = require("jsonwebtoken");
const { sequelize, Model } = require("../../../db");
const Sequelize = require("sequelize");
const { Op, literal } = require("sequelize");

const Setting = require("../../../models/settings");

const getMealEndTimeSettingsData = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1]; // Extract the token from the authorization header

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized User!" });
  }
  const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
  // console.log(process.env.JWT_SECRET)

  const { id, name } = decodedToken;
  // console.log(id)

  // const { user_id } = req.params; // Extract the user_id from req.params

  try {
    const settings = await Setting.findAll();

    const breakfastorderCheckingQueryForLoggedInUser = `
    SELECT orders.user_id FROM orders INNER JOIN menus 
    ON orders.menu_id = menus.menu_id WHERE orders.user_id = :id 
    AND CAST(menus.date AS DATE) = CURRENT_DATE() AND menus.meal_type = 'Breakfast';
    `;
    const isBreakfastOrderCompletedByLoggedInUser = await sequelize.query(
      breakfastorderCheckingQueryForLoggedInUser,
      {
        replacements: { id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const lunchOrderCheckingQueryForLoggedInUser = `
    SELECT orders.user_id FROM orders INNER JOIN menus 
    ON orders.menu_id = menus.menu_id WHERE orders.user_id = :id 
    AND CAST(menus.date AS DATE) = CURRENT_DATE() AND menus.meal_type = 'Lunch';
    `;
    const isLunchOrderCompletedByLoggedInUser = await sequelize.query(
      lunchOrderCheckingQueryForLoggedInUser,
      {
        replacements: { id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    res.json({
      code: 200,
      data: settings,
      isBreakfastOrderCompletedByLoggedInUser:
        isBreakfastOrderCompletedByLoggedInUser,
      isLunchOrderCompletedByLoggedInUser: isLunchOrderCompletedByLoggedInUser,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ code: 500, message: "Failed to fetch settings" });
  }
};

module.exports = { getMealEndTimeSettingsData };
