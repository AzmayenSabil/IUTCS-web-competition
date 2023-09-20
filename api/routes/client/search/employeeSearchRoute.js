const express = require("express");
const router = express.Router();
const employeeSearchController = require("../../../controller/client/search/employeeSearchController");
const { validateToken } = require("../../../middleware/token/clientJWT");

// Routes for users profile
router.get(
  "/active-employees",
  validateToken,
  employeeSearchController.getSearchResultOnActiveEmployees
);
router.get(
  "/expired-employees",
  validateToken,
  employeeSearchController.getSearchResultOnExpiredEmployees
);

module.exports = router;
