const Test = require("../models/test");
const cloudinary = require("../config/cloudinary");
const fs = require("fs/promises");

const uploadAudioToCloudinary = async (filePath) => {
    cloudinary.assertCloudinaryConfig();

    const result = await cloudinary.uploader.upload(filePath, {
        resource_type: "video",
        folder: "sas-academy/dictations"
    });

    return result.secure_url;
};

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

// ================= CREATE TEST =================
exports.createTest = async (req, res) => {
    try {
        const { title, type, duration, passage, category, tags, difficulty } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Missing title" });
        }

        let audioUrl = "";

        // CLOUDINARY UPLOAD
        if (type === "dictation") {
            if (!req.file) {
                return res.status(400).json({ message: "Audio required" });
            }

            audioUrl = await uploadAudioToCloudinary(req.file.path);
            await cleanupFile(req.file.path);
        }

        // NOTE: model uses audioURL (capital URL)
        const test = await Test.create({
            title,
            type,
            duration: Number(duration) || 5,
            passage: type === "transcription" ? passage : undefined,
            audioURL: audioUrl,
            category,
            difficulty,
            tags: tags ? tags.split(",") : [],
            createdBy: req.user.id,
        });


        res.json({ message: "Test created ✅", test });

    } catch (error) {
        await cleanupFile(req.file?.path);
        console.log("CREATE ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ================= GET ALL =================
exports.getTests = async (req, res) => {
    try {
        const query = {};

        if (req.query.type) {
            query.type = String(req.query.type).toLowerCase().trim();
        }

        if (req.query.search) {
            query.title = { $regex: req.query.search, $options: "i" };
        }

        const tests = await Test.find(query).sort({ createdAt: -1 });
        res.json(tests);
    } catch (error) {
        console.log("GET TESTS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ================= UPDATE =================
exports.updateTest = async (req, res) => {
    try {
        const { title, type, duration, passage, category, tags, difficulty } = req.body;

        const update = {
            title,
            type,
            duration: Number(duration) || 5,
            passage: type === "transcription" ? passage : undefined,
            category,
            difficulty,
            tags: Array.isArray(tags) ? tags : String(tags || "").split(",").map(tag => tag.trim()).filter(Boolean),
        };

        if (type === "dictation" && req.file) {
            update.audioURL = await uploadAudioToCloudinary(req.file.path);
            await cleanupFile(req.file.path);
        }

        const test = await Test.findByIdAndUpdate(req.params.id, update, {
            new: true,
            runValidators: true
        });

        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }

        res.json({ message: "Test updated", test });
    } catch (error) {
        await cleanupFile(req.file?.path);
        console.log("UPDATE TEST ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ================= DELETE =================
exports.deleteTest = async (req, res) => {
    try {
        const test = await Test.findByIdAndDelete(req.params.id);

        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }

        res.json({ message: "Test deleted" });
    } catch (error) {
        console.log("DELETE TEST ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ================= GET BY ID =================
exports.getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);

        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }

        res.json(test);
    } catch (error) {
        console.log("GET BY ID ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};
