const express = require("express");
const router = express.Router();
const fs = require("fs/promises");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/upload");

const cleanupFile = async (filePath) => {
    if (!filePath) return;
    try {
        await fs.unlink(filePath);
    } catch (error) {
        if (error.code !== "ENOENT") {
            console.warn("Temporary upload cleanup failed:", error.message);
        }
    }
};

router.post("/", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        cloudinary.assertCloudinaryConfig();

        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "auto",
            folder: "sas-academy/uploads"
        });

        await cleanupFile(req.file.path);

        res.json({
            message: "Upload successful",
            url: result.secure_url
        });

    } catch (error) {
        await cleanupFile(req.file?.path);
        console.log("UPLOAD ERROR:", error);
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

module.exports = router;
