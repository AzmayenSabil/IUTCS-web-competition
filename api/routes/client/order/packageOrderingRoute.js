const express = require("express");
const router = express.Router();
const packageOrderingController = require("../../../controller/client/order/packageOrderingController");
const { validateToken } = require("../../../middleware/token/clientJWT");

router.post("/", validateToken, packageOrderingController.createOrder);
router.get(
  "/menu_id/:user_id",
  validateToken,
  packageOrderingController.getAllMenuId
);
router.get(
  "/total-orders/:user_id",
  validateToken,
  packageOrderingController.getAggregatedOrderData
);
router.get(
  "/present-orders/:user_id",
  validateToken,
  packageOrderingController.getClientPresentOrderHistory
);
router.get(
  "/past-orders/:user_id",
  validateToken,
  packageOrderingController.getClientPastOrderHistory
);
router.delete(
  "/:menu_id",
  validateToken,
  packageOrderingController.deleteOrderByMenuId
);

module.exports = router;
