const express = require("express");
const router = express.Router();
const currentDateMealListController = require("../../../controller/client/display/currentDateMealListController");
const { validateToken } = require("../../../middleware/token/clientJWT");

router.get(
  "/current-date-meal-list/:user_id",
  validateToken,
  currentDateMealListController.getCurrentDateMealList
);

module.exports = router;
