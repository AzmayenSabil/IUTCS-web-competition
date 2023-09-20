const fs = require("fs-extra");
const path = require("path");
const User = require("../../../models/users");
const multer = require("multer");
const moment = require("moment");
const EmergencyContact = require("../../../models/emergencyContacts");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const { sequelize, Model } = require("../../../db");

let ignorefields = [
  "role",
  "user_id",
  "createdAt",
  "updatedAt",
  "password",
  "id",
];
const uploadingScannedDocuments = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized User!" });
  }
  const queriedUserID = req.params.user_id;

  try {
    const user = await User.findOne({ where: { user_id: queriedUserID } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userUploadsFolder = path.join(
      __dirname,
      `../../../uploads/client/${queriedUserID}`
    );

    if (req.files.passportImage) {
      user.passport_size_photo = req.files.passportImage[0].filename;
    }
    if (req.files.nid) {
      user.nid = req.files.nid[0].filename;
    }
    if (req.files.tinDoc) {
      user.tin = req.files.tinDoc[0].filename;
    }
    if (req.files.taxReturnDoc) {
      user.tax_return_documents = req.files.taxReturnDoc[0].filename;
    }
    if (req.files.officeClearanceCertificate) {
      user.last_office_clearance =
        req.files.officeClearanceCertificate[0].filename;
    }
    if (req.files.officeSalaryCertificate) {
      user.last_office_salary_certificate =
        req.files.officeSalaryCertificate[0].filename;
    }
    if (req.files.sscDoc) {
      user.ssc_certificate = req.files.sscDoc[0].filename;
    }
    if (req.files.hscDoc) {
      user.hsc_certificate = req.files.hscDoc[0].filename;
    }
    if (req.files.honsDoc) {
      user.hons_certificate = req.files.honsDoc[0].filename;
    }
    if (req.files.passportDoc) {
      user.passport = req.files.passportDoc[0].filename;
    }
    // Add more if statements for other file types as needed

    // Save the updated user document
    await user.save();

    await fs.ensureDir(userUploadsFolder);

    async function deleteDuplicateFilesByFileType() {
      try {
        const files = await fs.readdir(userUploadsFolder);
        const fileMap = {};
        // console.log(files);

        for (const file of files) {
          const extension = path.extname(file);
          const fileNameWithoutExtension = path.basename(file, extension);
          const fileType = fileNameWithoutExtension.split("_").pop();

          if (fileType) {
            if (!fileMap[fileType]) {
              fileMap[fileType] = [];
            }

            fileMap[fileType].push(file);
          }
        }
        // console.log(fileMap);

        for (const fileType in fileMap) {
          if (fileMap[fileType].length > 1) {
            // Sort files by timestamp in ascending order
            fileMap[fileType].sort((a, b) => {
              const [, timestampA] = a.split("_");
              const [, timestampB] = b.split("_");
              return parseInt(timestampA) - parseInt(timestampB);
            });

            // Delete duplicates except the one with the highest timestamp
            const filesToDelete = fileMap[fileType].slice(0, -1); // Remove the last (highest timestamp) file
            for (const fileToDelete of filesToDelete) {
              const filePathToDelete = path.join(
                userUploadsFolder,
                fileToDelete
              );
              await fs.unlink(filePathToDelete);
              // console.log(`Deleted duplicate file: ${filePathToDelete}`);
            }
          }
        }

        // console.log("Deleted duplicate files based on file type.");
      } catch (error) {
        console.error("Error deleting duplicate files:", error);
      }
    }

    const processFile = async (fieldName) => {
      const files = req.files[fieldName];
      // console.log(files, fieldName);

      if (!Array.isArray(files)) {
        // Handle single file upload
        const file = files;

        if (file) {
          const extension = path.extname(file.originalname);
          const timeStamp = moment().unix();
          const fileType = file.fieldname; // Assuming fileType comes from the fieldname
          const fileName = `${queriedUserID}_${timeStamp}_${fileType}${extension}`;
          const filePath = path.join(userUploadsFolder, fileName);

          try {
            // Delete the duplicate file with the same fileType
            await deleteDuplicateFilesByFileType(fileType);

            // Move the uploaded file to the user's folder using fs-extra's move method
            await fs.move(file.path, filePath);
          } catch (error) {
            // Handle errors here
          }
        }
      } else {
        // Handle multiple file upload

        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          if (file) {
            const extension = path.extname(file.originalname);
            const timeStamp = moment().unix();
            const fileType = file.fieldname; // Assuming fileType comes from the fieldname
            const fileName = `${queriedUserID}_${timeStamp}_${fileType}${extension}`;
            const filePath = path.join(userUploadsFolder, fileName);

            try {
              // Delete the duplicate file with the same fileType
              await deleteDuplicateFilesByFileType(fileType);

              // Move the uploaded file to the user's folder using fs-extra's move method
              await fs.move(file.path, filePath);
            } catch (error) {
              // Handle errors here
            }
          }
        }
      }
    };

    // Call processFile for each field
    await processFile("passportImage", "passport_size_photo");
    await processFile("nid", "nid");
    await processFile("passportDoc", "passport");
    await processFile("tinDoc", "tin");
    await processFile("officeClearanceCertificate", "last_office_clearance");
    await processFile(
      "officeSalaryCertificate",
      "last_office_salary_certificate"
    );
    await processFile("taxReturnDoc", "tax_return_documents");
    await processFile("sscDoc", "ssc");
    await processFile("hscDoc", "hsc");
    await processFile("honsDoc", "hons");
    await user.save();

    const emergency_contact = await EmergencyContact.findOne({
      where: { user_id: queriedUserID },
    });

    const userEmergencyContacts = await EmergencyContact.findOne({
      where: { user_id: queriedUserID },
      attributes: ["user_id", "emergency_contact_one", "emergency_contact_two"],
    });
    // Check if the user has existing emergency contact entry

    const QueryForFindingTotalNumberOfColumnsInUserTable = `
  SELECT COUNT(*) AS total_columns_in_user_table
  FROM information_schema.columns
  WHERE table_schema = 'meal_time'
    AND table_name = 'users';
  `;
    const QueryForFindingTotalNumberOfColumnsInEmergencyContactTable = `
  SELECT COUNT(*) AS total_columns_in_emergency_contact_table
  FROM information_schema.columns
  WHERE table_schema = 'meal_time'
    AND table_name = 'emergencycontacts';
  `;

    const getTotalNumberOfColumnsInUserTable = await sequelize.query(
      QueryForFindingTotalNumberOfColumnsInUserTable,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const getTotalNumberOfColumnsInEmergencyContactTable =
      await sequelize.query(
        QueryForFindingTotalNumberOfColumnsInEmergencyContactTable,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );

    // Calculate filled fields and profile completion percentage
    let filledFieldsForUserTable = 0;
    let filledFieldsForEmergencyContactTable = 0;
    if (user) {
      for (const field in user.dataValues) {
        if (ignorefields.includes(field)) {
          continue;
        }
        if (user.dataValues[field]) {
          filledFieldsForUserTable++;
        }
      }
    }

    filledFieldsForUserTable = filledFieldsForUserTable;

    if (emergency_contact) {
      for (const field in emergency_contact.dataValues) {
        if (ignorefields.includes(field)) {
          continue;
        }
        if (emergency_contact.dataValues[field]) {
          filledFieldsForEmergencyContactTable++;
        }
      }
    }

    filledFieldsForEmergencyContactTable = filledFieldsForEmergencyContactTable;

    const totalField = parseInt(
      getTotalNumberOfColumnsInUserTable[0].total_columns_in_user_table +
        getTotalNumberOfColumnsInEmergencyContactTable[0]
          .total_columns_in_emergency_contact_table -
        9
    );
    //  console.log(totalField);
    const profileCompletionProgressPercentage =
      ((filledFieldsForUserTable + filledFieldsForEmergencyContactTable) /
        totalField) *
      100;
    //  console.log(filledFieldsForUserTable, filledFieldsForEmergencyContactTable);

    //  console.log(profileCompletionProgressPercentage.toFixed(0));
    res.json({
      code: 200,
      data: {
        user_id: queriedUserID,
        user: {
          ssc_certificate: user.ssc_certificate,
          hsc_certificate: user.hsc_certificate,
          tin: user.tin,
          hons_certificate: user.hons_certificate,
          last_office_clearance: user.last_office_clearance,
          tax_return_documents: user.tax_return_documents,
          last_office_salary_certificate: user.last_office_salary_certificate,
          nid: user.nid,
          passport: user.passport,
          passport_size_photo: user.passport_size_photo,
        },
        message: "Files uploaded successfully",
        dataForEmergencyContacts: userEmergencyContacts,
        profileCompletionProgressPercentage:
          profileCompletionProgressPercentage.toFixed(0),
      },
    });
  } catch (error) {
    console.error("Upload information data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { uploadingScannedDocuments };
