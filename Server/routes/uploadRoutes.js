const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// multer setup
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
    try {
        console.log("FILE:", req.file); // debug

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // upload to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "auto"
        });

        res.json({
            message: "Upload successful ✅",
            url: result.secure_url
        });

    } catch (error) {
        console.log("UPLOAD ERROR:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;