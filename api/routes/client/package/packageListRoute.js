const express = require("express");
const router = express.Router();
const packageListController = require("../../../controller/client/package/packageListController");
const { validateToken } = require("../../../middleware/token/clientJWT");

router.get("/", validateToken, packageListController.getPackageList);

module.exports = router;
