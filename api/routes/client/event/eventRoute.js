const express = require("express");
const router = express.Router();
const eventController = require("../../../controller/client/event/eventController");
const { validateToken } = require("../../../middleware/token/clientJWT");

router.get(
  "/birthday-event/:user_id",
  validateToken,
  eventController.getEventList
);

module.exports = router;
