const express = require("express");
const router = express.Router();
const dashboardController = require("../../../controller/admin/dashboard/dashboardController");
const { validateToken } = require("../../../middleware/token/adminJWT");

router.get(
  "/data",
  validateToken,
  dashboardController.getAllAggregatedDataForDashboardCards
);

module.exports = router;
