// const express = require("express");
// const router = express.Router();
// const { File } = require("../models");
// const AWS = require("aws-sdk");
// const multer = require("multer");
// const upload = multer({ storage: multer.memoryStorage() });
// const { v4: uuidv4 } = require("uuid");

// // Initialize S3 client
// const s3 = new AWS.S3();

// const startS3 = Date.now();

// router.get('/file', (req, res) => res.status(400).send());
// router.delete('/file', (req, res) => res.status(400).send());

// // Middleware to handle unsupported methods for /v1/file
// router.all("/file", (req, res, next) => {
//   if (req.method !== "POST") {
//     return res.status(405).send(); // Return 405 for any method other than POST
//   }
//   if (Object.keys(req.query).length > 0) {
//     return res.status(405).send(); // Return 405 with no body
//   }
//   next(); // Pass control to the next middleware/route handler
// });

// // Upload file
// router.post("/file", upload.single("file"), async (req, res) => {
//   try {
//     const file = req.file;

//     if (!file) {
//       return res.status(400).send();
//     }

//     const fileId = uuidv4();
//     const filePath = `files/${fileId}-${file.originalname}`;

//     // Upload file to S3
//     await s3
//       .upload({
//         Bucket: process.env.S3_BUCKET,
//         Key: filePath,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//       })
//       .promise();

//     // Save file metadata to database
//     const fileMetadata = await File.create({
//       fileId,
//       fileName: file.originalname,
//       filePath,
//     });

//     // Construct the response object
//     const response = {
//       file_name: file.originalname, // File name
//       id: fileId, // File ID
//       url: `${process.env.S3_BUCKET}/${filePath}`, // Full URL to the file
//       upload_date: new Date().toISOString().split("T")[0], // Upload date in YYYY-MM-DD format
//     };

//     res.status(201).json(response);
//   } catch (err) {
//     console.error("Error uploading file:", err);
//     res.status(400).send();
//   }
// });

// // Middleware to handle unsupported methods for /v1/file/:fileId
// router.all("/file/:fileId", (req, res, next) => {
//   if (req.method !== "GET" && req.method !== "DELETE") {
//     return res.status(405).send(); // Return 405 for any method other than GET, DELETE, or HEAD
//   }
//   if (Object.keys(req.query).length > 0) {
//     return res.status(405).send(); // Return 405 with no body
//   }
//   next(); // Pass control to the next middleware/route handler
// });

// // Get file metadata
// router.get("/file/:fileId", async (req, res) => {
//   try {
//     const fileId = req.params.fileId;
//     const fileMetadata = await File.findOne({ where: { fileId } });
//     if (!fileMetadata) {
//       return res.status(404).send();
//     }

//     // Construct the response object
//     const response = {
//       file_name: fileMetadata.fileName, // File name
//       id: fileMetadata.fileId, // File ID
//       url: `${process.env.S3_BUCKET}/${fileMetadata.filePath}`, // Full URL to the file
//       upload_date: new Date(fileMetadata.createdAt).toISOString().split("T")[0], // Upload date in YYYY-MM-DD format
//     };

//     res.status(200).json(response);
//   } catch (err) {
//     console.error("Error retrieving file metadata:", err);
//     res.status(404).send();
//   }
// });

// // Delete file
// router.delete("/file/:fileId", async (req, res) => {
//   try {
//     const fileId = req.params.fileId;
//     const fileMetadata = await File.findOne({ where: { fileId } });

//     if (!fileMetadata) {
//       return res.status(404).send();
//     }

//     // Delete file from S3
//     await s3
//       .deleteObject({
//         Bucket: process.env.S3_BUCKET,
//         Key: fileMetadata.filePath,
//       })
//       .promise();

//     // Delete file metadata from database
//     await fileMetadata.destroy();

//     res.status(204).send();
//   } catch (err) {
//     console.error("Error deleting file:", err);
//     res.status(404).send();
//   }
// });

// // Custom 404 handler for undefined routes
// router.use((req, res) => {
//   res.status(404).send(); // Return 404 with no response body
// });

// const s3Duration = Date.now() - startS3;
// client.timing("s3.call_time", s3Duration);

// module.exports = router;


// code 2
// const express = require("express");
// const router = express.Router();
// const { File } = require("../models");
// const AWS = require("aws-sdk");
// const multer = require("multer");
// const upload = multer({ storage: multer.memoryStorage() });
// const { v4: uuidv4 } = require("uuid");
// const StatsD = require("hot-shots");
// const client = new StatsD();
// const s3 = new AWS.S3();

// router.get('/file', (req, res) => res.status(400).send());
// router.delete('/file', (req, res) => res.status(400).send());

// router.all("/file", (req, res, next) => {
//   if (req.method !== "POST") {
//     return res.status(405).send();
//   }
//   if (Object.keys(req.query).length > 0) {
//     return res.status(405).send();
//   }
//   next();
// });

// router.post("/file", upload.single("file"), async (req, res) => {
//   const startApi = Date.now();
//   try {
//     const file = req.file;

//     if (!file) {
//       return res.status(400).send();
//     }

//     const fileId = uuidv4();
//     const filePath = `files/${fileId}-${file.originalname}`;

//     const startS3 = Date.now();
//     await s3
//       .upload({
//         Bucket: process.env.S3_BUCKET,
//         Key: filePath,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//       })
//       .promise();
//     client.timing("s3.upload_time", Date.now() - startS3);

//     const startDb = Date.now();
//     const fileMetadata = await File.create({
//       fileId,
//       fileName: file.originalname,
//       filePath,
//     });
//     client.timing("db.insert_time", Date.now() - startDb);

//     const response = {
//       file_name: file.originalname,
//       id: fileId,
//       url: `${process.env.S3_BUCKET}/${filePath}`,
//       upload_date: new Date().toISOString().split("T")[0],
//     };

//     client.timing("api.post_file", Date.now() - startApi);
//     res.status(201).json(response);
//   } catch (err) {
//     console.error("Error uploading file:", err);
//     client.timing("api.post_file", Date.now() - startApi);
//     res.status(400).send();
//   }
// });

// router.all("/file/:fileId", (req, res, next) => {
//   if (req.method !== "GET" && req.method !== "DELETE") {
//     return res.status(405).send();
//   }
//   if (Object.keys(req.query).length > 0) {
//     return res.status(405).send();
//   }
//   next();
// });

// router.get("/file/:fileId", async (req, res) => {
//   const startApi = Date.now();
//   try {
//     const fileId = req.params.fileId;
//     const startDb = Date.now();
//     const fileMetadata = await File.findOne({ where: { fileId } });
//     client.timing("db.get_file", Date.now() - startDb);

//     if (!fileMetadata) {
//       return res.status(404).send();
//     }

//     const response = {
//       file_name: fileMetadata.fileName,
//       id: fileMetadata.fileId,
//       url: `${process.env.S3_BUCKET}/${fileMetadata.filePath}`,
//       upload_date: new Date(fileMetadata.createdAt).toISOString().split("T")[0],
//     };

//     client.timing("api.get_file", Date.now() - startApi);
//     res.status(200).json(response);
//   } catch (err) {
//     console.error("Error retrieving file metadata:", err);
//     client.timing("api.get_file", Date.now() - startApi);
//     res.status(404).send();
//   }
// });

// router.delete("/file/:fileId", async (req, res) => {
//   const startApi = Date.now();
//   try {
//     const fileId = req.params.fileId;
//     const startDb = Date.now();
//     const fileMetadata = await File.findOne({ where: { fileId } });
//     client.timing("db.find_file_for_delete", Date.now() - startDb);

//     if (!fileMetadata) {
//       return res.status(404).send();
//     }

//     const startS3 = Date.now();
//     await s3
//       .deleteObject({
//         Bucket: process.env.S3_BUCKET,
//         Key: fileMetadata.filePath,
//       })
//       .promise();
//     client.timing("s3.delete_time", Date.now() - startS3);

//     const startDbDel = Date.now();
//     await fileMetadata.destroy();
//     client.timing("db.delete_file", Date.now() - startDbDel);

//     client.timing("api.delete_file", Date.now() - startApi);
//     res.status(204).send();
//   } catch (err) {
//     console.error("Error deleting file:", err);
//     client.timing("api.delete_file", Date.now() - startApi);
//     res.status(404).send();
//   }
// });

// router.use((req, res) => {
//   res.status(404).send();
// });

// module.exports = router;


// code 2
const express = require("express");
const router = express.Router();
const { File } = require("../models");
const AWS = require("aws-sdk");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { v4: uuidv4 } = require("uuid");
const StatsD = require("hot-shots");
const winston = require("winston");

// Added: Logger setup
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({ filename: '/var/log/webapp.log' })
  ]
});

const client = new StatsD();
const s3 = new AWS.S3();

router.get('/file', (req, res) => res.status(400).send());
router.delete('/file', (req, res) => res.status(400).send());

router.all("/file", (req, res, next) => {
  if (req.method !== "POST") {
    logger.warn("/file endpoint hit with invalid method");
    return res.status(405).send();
  }
  if (Object.keys(req.query).length > 0) {
    logger.warn("/file endpoint hit with query params");
    return res.status(405).send();
  }
  next();
});

router.post("/file", upload.single("file"), async (req, res) => {
  const startApi = Date.now();
  try {
    const file = req.file;

    if (!file) {
      logger.warn("POST /file called without a file attached.");
      return res.status(400).send();
    }

    const fileId = uuidv4();
    const filePath = `files/${fileId}-${file.originalname}`;

    logger.info(`Uploading file: ${file.originalname} to path: ${filePath}`);

    const startS3 = Date.now();
    await s3
      .upload({
        Bucket: process.env.S3_BUCKET,
        Key: filePath,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();
    client.timing("s3.upload_time", Date.now() - startS3);
    logger.debug("File successfully uploaded to S3");

    const startDb = Date.now();
    const fileMetadata = await File.create({
      fileId,
      fileName: file.originalname,
      filePath,
    });
    client.timing("db.insert_time", Date.now() - startDb);
    logger.info(`File metadata saved to DB with ID: ${fileMetadata.id}`);

    const response = {
      file_name: file.originalname,
      id: fileId,
      url: `${process.env.S3_BUCKET}/${filePath}`,
      upload_date: new Date().toISOString().split("T")[0],
    };

    client.timing("api.post_file", Date.now() - startApi);
    res.status(201).json(response);
  } catch (err) {
    logger.error(`Error uploading file: ${err.message}`);
    client.timing("api.post_file", Date.now() - startApi);
    res.status(400).send();
  }
});

router.all("/file/:fileId", (req, res, next) => {
  if (req.method !== "GET" && req.method !== "DELETE") {
    logger.warn("/file/:fileId endpoint hit with invalid method");
    return res.status(405).send();
  }
  if (Object.keys(req.query).length > 0) {
    logger.warn("/file/:fileId endpoint hit with query params");
    return res.status(405).send();
  }
  next();
});

router.get("/file/:fileId", async (req, res) => {
  const startApi = Date.now();
  try {
    const fileId = req.params.fileId;
    logger.info(`Fetching metadata for file ID: ${fileId}`);

    const startDb = Date.now();
    const fileMetadata = await File.findOne({ where: { fileId } });
    client.timing("db.get_file", Date.now() - startDb);

    if (!fileMetadata) {
      logger.warn(`No file found with ID: ${fileId}`);
      return res.status(404).send();
    }

    const response = {
      file_name: fileMetadata.fileName,
      id: fileMetadata.fileId,
      url: `${process.env.S3_BUCKET}/${fileMetadata.filePath}`,
      upload_date: new Date(fileMetadata.createdAt).toISOString().split("T")[0],
    };

    client.timing("api.get_file", Date.now() - startApi);
    res.status(200).json(response);
  } catch (err) {
    logger.error(`Error retrieving file metadata: ${err.message}`);
    client.timing("api.get_file", Date.now() - startApi);
    res.status(404).send();
  }
});

router.delete("/file/:fileId", async (req, res) => {
  const startApi = Date.now();
  try {
    const fileId = req.params.fileId;
    logger.info(`Attempting to delete file with ID: ${fileId}`);

    const startDb = Date.now();
    const fileMetadata = await File.findOne({ where: { fileId } });
    client.timing("db.find_file_for_delete", Date.now() - startDb);

    if (!fileMetadata) {
      logger.warn(`File not found for deletion with ID: ${fileId}`);
      return res.status(404).send();
    }

    const startS3 = Date.now();
    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: fileMetadata.filePath,
      })
      .promise();
    client.timing("s3.delete_time", Date.now() - startS3);
    logger.info(`Deleted file from S3: ${fileMetadata.filePath}`);

    const startDbDel = Date.now();
    await fileMetadata.destroy();
    client.timing("db.delete_file", Date.now() - startDbDel);
    logger.info(`Deleted file metadata from DB for ID: ${fileId}`);

    client.timing("api.delete_file", Date.now() - startApi);
    res.status(204).send();
  } catch (err) {
    logger.error(`Error deleting file: ${err.message}`);
    client.timing("api.delete_file", Date.now() - startApi);
    res.status(404).send();
  }
});

router.use((req, res) => {
  logger.warn(`Unhandled route hit: ${req.method} ${req.originalUrl}`);
  res.status(404).send();
});

module.exports = router;

