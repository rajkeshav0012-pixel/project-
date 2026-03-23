const express = require("express");
const path = require("path");
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// POST /api/upload  (auth required)
router.post("/", authMiddleware, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.json({
      message: "File uploaded successfully",
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        url: fileUrl,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error during file upload" });
  }
});

// Handle multer errors
router.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File too large. Max size is 10MB" });
  }
  res.status(400).json({ message: err.message });
});

module.exports = router;
