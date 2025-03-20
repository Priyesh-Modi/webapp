const express = require("express");
const router = express.Router();
const { File } = require("../models");
const AWS = require("aws-sdk");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { v4: uuidv4 } = require("uuid");

// Initialize S3 client
const s3 = new AWS.S3();

router.get('/file', (req, res) => res.status(400).send());
router.delete('/file', (req, res) => res.status(400).send());

// Middleware to handle unsupported methods for /v1/file
router.all("/file", (req, res, next) => {
  if (req.method !== "POST") {
    return res.status(405).send(); // Return 405 for any method other than POST
  }
  if (Object.keys(req.query).length > 0) {
    return res.status(405).send(); // Return 405 with no body
  }
  next(); // Pass control to the next middleware/route handler
});

// Upload file
router.post("/file", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send();
    }

    const fileId = uuidv4();
    const filePath = `files/${fileId}-${file.originalname}`;

    // Upload file to S3
    await s3
      .upload({
        Bucket: process.env.S3_BUCKET,
        Key: filePath,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();

    // Save file metadata to database
    const fileMetadata = await File.create({
      fileId,
      fileName: file.originalname,
      filePath,
    });

    // Construct the response object
    const response = {
      file_name: file.originalname, // File name
      id: fileId, // File ID
      url: `${process.env.S3_BUCKET}/${filePath}`, // Full URL to the file
      upload_date: new Date().toISOString().split("T")[0], // Upload date in YYYY-MM-DD format
    };

    res.status(201).json(response);
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(400).send();
  }
});

// Middleware to handle unsupported methods for /v1/file/:fileId
router.all("/file/:fileId", (req, res, next) => {
  if (req.method !== "GET" && req.method !== "DELETE") {
    return res.status(405).send(); // Return 405 for any method other than GET, DELETE, or HEAD
  }
  if (Object.keys(req.query).length > 0) {
    return res.status(405).send(); // Return 405 with no body
  }
  next(); // Pass control to the next middleware/route handler
});

// Get file metadata
router.get("/file/:fileId", async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const fileMetadata = await File.findOne({ where: { fileId } });
    if (!fileMetadata) {
      return res.status(404).send();
    }

    // Construct the response object
    const response = {
      file_name: fileMetadata.fileName, // File name
      id: fileMetadata.fileId, // File ID
      url: `${process.env.S3_BUCKET}/${fileMetadata.filePath}`, // Full URL to the file
      upload_date: new Date(fileMetadata.createdAt).toISOString().split("T")[0], // Upload date in YYYY-MM-DD format
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error retrieving file metadata:", err);
    res.status(404).send();
  }
});

// Delete file
router.delete("/file/:fileId", async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const fileMetadata = await File.findOne({ where: { fileId } });

    if (!fileMetadata) {
      return res.status(404).send();
    }

    // Delete file from S3
    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: fileMetadata.filePath,
      })
      .promise();

    // Delete file metadata from database
    await fileMetadata.destroy();

    res.status(204).send();
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(404).send();
  }
});

// Custom 404 handler for undefined routes
router.use((req, res) => {
  res.status(404).send(); // Return 404 with no response body
});

module.exports = router;
