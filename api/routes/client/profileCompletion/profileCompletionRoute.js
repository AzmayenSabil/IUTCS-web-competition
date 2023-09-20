const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const User = require("../../../models/users");
const profileCompletionController = require("../../../controller/client/profileCompletion/profileCompletionController");
const profileCompletionControllerForScannedDocument = require("../../../controller/client/profileCompletion/scannedDocumentUploadController");
const { validateToken } = require("../../../middleware/token/clientJWT");
const moment = require("moment");

// Set up Multer storage and file naming

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.params.user_id;
    const userUploadsFolder = path.join("uploads/client", userId);
    // console.log(file);

    // Create the user's folder if it doesn't exist
    fs.ensureDirSync(userUploadsFolder);

    // Set the destination folder for the current file
    cb(null, userUploadsFolder);
  },
  filename: (req, file, cb) => {
    const userId = req.params.user_id;

    const extension = path.extname(file.originalname);
    const timeStamp = moment().unix();
    const fileName = `${userId}_${timeStamp}_${file.fieldname}${extension}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// Routes for users profile completion
router.put(
  "/basic-information/:user_id",
  validateToken,
  profileCompletionController.basicInformationCompletion
);
router.put(
  "/general-information/:user_id",
  validateToken,
  profileCompletionController.generalInformationCompletion
);
router.put(
  "/emergency-contact-information/:user_id",
  validateToken,
  profileCompletionController.emergencyContactInformation
);
router.put(
  "/confidential-information/:user_id",
  validateToken,
  profileCompletionController.confidentialInformationCompletion
);

//upload route
router.put(
  "/scanned-document/:user_id",
  upload.fields([
    { name: "passportImage" },
    { name: "nid" },
    { name: "passportDoc" },
    { name: "tinDoc" },
    { name: "officeClearanceCertificate" },
    { name: "officeSalaryCertificate" },
    { name: "taxReturnDoc" },
    { name: "sscDoc" },
    { name: "hscDoc" },
    { name: "honsDoc" },
  ]),

  validateToken,
  profileCompletionControllerForScannedDocument.uploadingScannedDocuments
);

module.exports = router;
