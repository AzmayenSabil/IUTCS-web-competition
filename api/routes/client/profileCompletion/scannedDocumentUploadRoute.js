// const express = require("express");
// const router = express.Router();
// const multer = require('multer');
// const fs = require('fs-extra');
// const path = require('path');
// const profileCompletionController = require("../../../controller/client/profileCompletion/profileCompletionController");
// const profileCompletionControllerForScannedDocument = require("../../../controller/client/profileCompletion/scannedDocumentUploadController");
// const { validateToken } = require("../../../middleware/token/clientJWT");

// // Set up Multer storage and file naming
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       const userId = req.params.user_id;
//       const userUploadsFolder = path.join('../../../uploads/client', userId);

//       // Create the user's folder if it doesn't exist
//       fs.ensureDirSync(userUploadsFolder);

//       // Set the destination folder for the current file
//       cb(null, userUploadsFolder);
//     },
//     filename: (req, file, cb) => {
//      const userId = req.params.user_id;
//      const fileType = req.params
//      console.log(fileType)
//       const fileName = `${userId}_${Date.now()}_${file.originalname}`;
//       cb(null, fileName);
//     },
//   });

//   const upload = multer({ storage });

// // Routes for users profile completion
// router.put("/basic-information/:user_id",validateToken,profileCompletionController.basicInformationCompletion);
// router.put("/general-information/:user_id",validateToken,profileCompletionController.generalInformationCompletion);
// router.put("/emergency-contact-information/:user_id",validateToken,profileCompletionController.emergencyContactInformation);
// router.put("/confidential-information/:user_id",validateToken,profileCompletionController.confidentialInformationCompletion);

// //upload route
// router.put("/scanned-document/:user_id", upload.fields([{ name: 'passportImage' }, { name: 'nid' }]), validateToken, profileCompletionControllerForScannedDocument.uploadingScannedDocuments);

// module.exports = router;
