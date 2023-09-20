const express = require("express");
const router = express.Router();
const packageController = require("../../../controller/admin/package/packageController");
const { validateToken } = require("../../../middleware/token/adminJWT");

// Route to get all package
router.get("/", validateToken, packageController.getAllPackage);

// Route to add a new package
router.post("/", validateToken, packageController.addPackage);

// Route to update a package
router.put("/:packageId", validateToken, packageController.updatePackage);

// Route to verify package deletion
router.get(
  "/verify/:packageId",
  validateToken,
  packageController.verifyDeletion
);

// Route to delete a package
router.delete("/:packageId", validateToken, packageController.deletePackage);

module.exports = router;
