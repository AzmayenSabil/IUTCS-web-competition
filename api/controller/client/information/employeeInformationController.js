const Package = require("../../../models/packages");
const Menu = require("../../../models/menus");
const User = require("../../../models/users");
const { sequelize, Model } = require("../../../db");
const Sequelize = require("sequelize");

const {
  createTokens,
  validateToken,
} = require("../../../middleware/token/clientJWT");
const { verify } = require("jsonwebtoken");
require("dotenv").config();

const getEmployeeInformation = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1]; // Extract the token from the authorization header
    const decodedToken = verify(accessToken, process.env.JWT_SECRET);
    const { id, name } = decodedToken;

    const { page, limit } = req.query;
    // console.log(page, limit)
    // const limit = 3;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const activeEmployeesInformationQuery = `
   
   SELECT
   users.user_id as user_id,
    users.name AS name,
    users.email AS email,
    users.employee_id AS employee_id,
    users.gender AS gender,
    users.passport_size_photo as photo,
    users.type as type,
    users.designation as designation,
    users.department as department
    FROM
    users
    WHERE
    users.active = 'yes' 
    LIMIT :limit OFFSET :offset ;
   `;

    const activeEployeesInformationList = await sequelize.query(
      activeEmployeesInformationQuery,
      {
        replacements: { limit: parseInt(limit), offset },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const loggedInUserEmployeeIDQuery = `
    SELECT users.employee_id from users where users.user_id = :id
    `;
    const loggedInUserEmployeeID = await sequelize.query(
      loggedInUserEmployeeIDQuery,
      {
        replacements: { id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const expiredEmployeesInformationQuery = `
   
    SELECT
     users.user_id as user_id,
     users.name AS name,
     users.email AS email,
     users.employee_id AS employee_id,
     users.gender AS gender,
     users.passport_size_photo as photo,
     users.type as type,
     users.designation as designation,
     users.department as department
     FROM
     users
     WHERE
     users.current_status = 'retired'
     LIMIT :limit OFFSET :offset ;
    `;

    const expiredEployeesInformationList = await sequelize.query(
      expiredEmployeesInformationQuery,
      {
        replacements: { limit: parseInt(limit), offset },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const totalNumberOfActiveUsersQuery = `
   
   SELECT COUNT(USERS.USER_ID) AS total_users from users where users.active= 'yes'  ;
   `;

    const total_number_of_active_users = await sequelize.query(
      totalNumberOfActiveUsersQuery,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const totalNumberOfExpiredUsersQuery = `
   
   SELECT COUNT(USERS.USER_ID) AS total_users from users where users.current_status = 'retired';
   `;

    const total_number_of_expired_users = await sequelize.query(
      totalNumberOfExpiredUsersQuery,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      code: 200,
      // token: accessToken,
      data: {
        user_id: id,
        username: name,
        loggedInUserEmployeeID: loggedInUserEmployeeID[0],
        activeEployeesInformationList: activeEployeesInformationList,
        expiredEployeesInformationList: expiredEployeesInformationList,
        total_number_of_active_users: total_number_of_active_users,
        total_number_of_expired_users: total_number_of_expired_users,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getEmployeeInformation };
