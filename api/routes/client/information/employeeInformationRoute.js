const express = require("express");
const router = express.Router();
const employeeInformationController = require("../../../controller/client/information/employeeInformationController");
const { validateToken } = require("../../../middleware/token/clientJWT");

// Route to get package list
router.get(
  "/:user_id",
  validateToken,
  employeeInformationController.getEmployeeInformation
);

module.exports = router;
