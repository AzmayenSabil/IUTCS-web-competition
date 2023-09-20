const Package = require("../../../models/packages");
const Menu = require("../../../models/menus");
const { sequelize, Model } = require("../../../db");
const Sequelize = require("sequelize");

const {
  createTokens,
  validateToken,
} = require("../../../middleware/token/clientJWT");
const { verify } = require("jsonwebtoken");
require("dotenv").config();
const getEventList = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1]; // Extract the token from the authorization header
    const decodedToken = verify(accessToken, process.env.JWT_SECRET);
    const { id, name } = decodedToken;

    const { user_id } = req.params;

    const birthdayEventQuery = `
    SELECT users.user_id as user_id, users.name as name, 
    users.email as email, users.date_of_birth as dob FROM users 
    WHERE users.user_id = :user_id AND 
    SUBSTRING(users.date_of_birth, 6) = SUBSTRING(CURRENT_DATE(), 6) ;
   
    ;`;

    const birthdayEventNotification = await sequelize.query(
      birthdayEventQuery,
      {
        replacements: { user_id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const totalBirthdayEventOnCurrentDateQuery = `
    SELECT COUNT(users.user_id) as total_birthday_event_on_current_date from users 
    WHERE 
    SUBSTRING(users.date_of_birth, 6) = SUBSTRING(CURRENT_DATE(), 6) ;
   
    
    `;
    const totalBirthdayEventOnCurrentDate = await sequelize.query(
      totalBirthdayEventOnCurrentDateQuery,
      {
        replacements: { user_id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const birthdayEventListQuery = `
    SELECT 
    users.user_id as user_id, 
    users.name as name, 
    users.email as email, 
    DATE_FORMAT(
        CONCAT(
            YEAR(CURRENT_DATE()), 
            '-', 
            LPAD(MONTH(users.date_of_birth), 2, '0'), 
            '-', 
            LPAD(DAY(users.date_of_birth), 2, '0')
        ), 
        '%d %M, %W'
    ) as dob 
FROM 
    users 
WHERE 
    (
        MONTH(users.date_of_birth) = MONTH(CURRENT_DATE()) 
        AND DAY(users.date_of_birth) >= DAY(CURRENT_DATE())
    )
    OR 
    (
        MONTH(users.date_of_birth) = MONTH(DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY)) 
        AND DAY(users.date_of_birth) >= DAY(DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY))
    ) 
ORDER BY 
    MONTH(users.date_of_birth), DAY(users.date_of_birth)

    ;
    `;

    const birthdayEventList = await sequelize.query(birthdayEventListQuery, {
      replacements: { user_id },
      type: Sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      code: 200,
      // token: accessToken,
      data: {
        user_id: id,
        username: name,
        birthdayEventNotification: birthdayEventNotification,
        birthdayEventList: birthdayEventList,
        totalBirthdayEventOnCurrentDate: totalBirthdayEventOnCurrentDate,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getEventList };
