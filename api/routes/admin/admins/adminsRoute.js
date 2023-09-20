const express = require("express");
const router = express.Router();
const adminController = require("../../../controller/admin/adminCreation/adminCrudController");
const { validateToken } = require("../../../middleware/token/adminJWT");

router.post("/create", validateToken, adminController.createAdmin);
router.get("/getAllAdmins", validateToken, adminController.getAllAdmin);
router.get("/getAdmin/:user_id", validateToken, adminController.getAdmin);
router.post("/update/:user_id", validateToken, adminController.updateAdmin);
router.delete(
  "/deleteAdmin/:user_id",
  validateToken,
  adminController.deleteAdmin
);
router.post(
  "/updateStatus/:user_id",
  validateToken,
  adminController.updateAdminStatus
);

module.exports = router;
