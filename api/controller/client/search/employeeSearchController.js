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
const getSearchResultOnActiveEmployees = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1]; // Extract the token from the authorization header
    const decodedToken = verify(accessToken, process.env.JWT_SECRET);
    const { id, name } = decodedToken;

    const { page, limit, searchQuery } = req.query;
    // console.log(page, limit)
    // console.log(req.query)
    // const limit = 3;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const activeEmployeesSearchQuery = `
    SELECT
    users.user_id as user_id,
    users.name AS name,
    users.email AS email,
    users.employee_id AS employee_id,
    users.gender AS gender,
    users.passport_size_photo as photo,
    users.department as department,
    users.type as type,
    users.designation as designation
FROM
    users
WHERE (LOWER(users.name) LIKE LOWER(:searchQuery) OR
       LOWER(users.email) LIKE LOWER(:searchQuery) OR
       users.employee_id LIKE :searchQuery OR
       LOWER(users.gender) LIKE LOWER(:searchQuery) OR
       LOWER(users.department) LIKE LOWER(:searchQuery) OR
       LOWER(users.type) LIKE LOWER(:searchQuery) OR
       LOWER(users.designation) LIKE LOWER(:searchQuery) 
       
       )
    AND users.active = 'yes'
LIMIT :limit OFFSET :offset ;
  
    `;

    const activeEmployeesSearchResult = await sequelize.query(
      activeEmployeesSearchQuery,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          searchQuery: `%${searchQuery.toLowerCase()}%`,
          limit: parseInt(limit),
          offset,
        },
      }
    );

    const totalActiveEmployeeOnSearchQuery = `
    SELECT COUNT(USERS.USER_ID) AS total_users from users 
    WHERE (
      LOWER(users.name) LIKE LOWER(:searchQuery) OR
    LOWER(users.email) LIKE LOWER(:searchQuery) OR
    users.employee_id LIKE :searchQuery OR
    LOWER(users.gender) LIKE LOWER(:searchQuery) OR
    LOWER(users.type) LIKE LOWER(:searchQuery) OR
    LOWER(users.department) LIKE LOWER(:searchQuery) OR
    LOWER(users.designation) LIKE LOWER(:searchQuery)
    )
    AND users.active = 'yes'

    `;
    const totalActiveEmployeeOnSearchResult = await sequelize.query(
      totalActiveEmployeeOnSearchQuery,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          searchQuery: `%${searchQuery.toLowerCase()}%`,
          limit: parseInt(limit),
          offset,
        },
      }
    );

    res.status(200).json({
      code: 200,
      // token: accessToken,
      data: {
        user_id: id,
        username: name,
        activeEmployeesSearchResult: activeEmployeesSearchResult,
        totalActiveEmployeeOnSearchResult: totalActiveEmployeeOnSearchResult,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
const getSearchResultOnExpiredEmployees = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1]; // Extract the token from the authorization header
    const decodedToken = verify(accessToken, process.env.JWT_SECRET);
    const { id, name } = decodedToken;

    const { page, limit, searchQuery } = req.query;
    // console.log(page, limit)
    // console.log(req.query)
    // const limit = 3;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const expiredEmployeesSearchQuery = `
    SELECT
    users.user_id as user_id,
    users.name AS name,
    users.email AS email,
    users.employee_id AS employee_id,
    users.gender AS gender,
    users.department as department,
    users.passport_size_photo as photo,
    users.type as type,
    users.designation as designation
FROM
    users
WHERE (
      LOWER(users.name) LIKE LOWER(:searchQuery) OR
       LOWER(users.email) LIKE LOWER(:searchQuery) OR
       users.employee_id LIKE :searchQuery OR
       LOWER(users.gender) LIKE LOWER(:searchQuery) OR
       LOWER(users.department) LIKE LOWER(:searchQuery) OR
       LOWER(users.type) LIKE LOWER(:searchQuery) OR
       LOWER(users.designation) LIKE LOWER(:searchQuery) 
       )
    AND  users.active != 'yes' or users.current_status = 'retired'
LIMIT :limit OFFSET :offset ;
    `;

    const expiredEmployeesSearchResult = await sequelize.query(
      expiredEmployeesSearchQuery,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          searchQuery: `%${searchQuery.toLowerCase()}%`,
          limit: parseInt(limit),
          offset,
        },
      }
    );

    const totalExpiredEmployeeOnSearchQuery = `

      SELECT COUNT(USERS.USER_ID) AS total_users from users 
      WHERE (
        LOWER(users.name) LIKE LOWER(:searchQuery) OR
      LOWER(users.email) LIKE LOWER(:searchQuery) OR
      users.employee_id LIKE :searchQuery OR
      LOWER(users.gender) LIKE LOWER(:searchQuery) OR
      LOWER(users.type) LIKE LOWER(:searchQuery) OR
      LOWER(users.department) LIKE LOWER(:searchQuery) OR
    LOWER(users.designation) LIKE LOWER(:searchQuery)
      )
      AND  users.active != 'yes' or users.current_status = 'retired'
  
      `;
    const totalExpiredEmployeeOnSearchResult = await sequelize.query(
      totalExpiredEmployeeOnSearchQuery,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          searchQuery: `%${searchQuery.toLowerCase()}%`,
          limit: parseInt(limit),
          offset,
        },
      }
    );

    res.status(200).json({
      code: 200,
      // token: accessToken,
      data: {
        user_id: id,
        username: name,
        expiredEmployeesSearchResult: expiredEmployeesSearchResult,
        totalExpiredEmployeeOnSearchResult: totalExpiredEmployeeOnSearchResult,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getSearchResultOnActiveEmployees,
  getSearchResultOnExpiredEmployees,
};
