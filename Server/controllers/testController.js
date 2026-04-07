<<<<<<< HEAD
const Test = require("../models/test");
const cloudinary = require("../config/cloudinary");

// ================= CREATE TEST =================
exports.createTest = async (req, res) => {
    try {
        const { title, type, duration, passage, category, tags } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Missing title" });
        }

        let audioUrl = "";

        // CLOUDINARY UPLOAD
        if (type === "dictation") {
            if (!req.file) {
                return res.status(400).json({ message: "Audio required" });
            }

            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "video"
            });

            audioUrl = result.secure_url;
        }

        const test = await Test.create({
            title,
            type,
            duration: Number(duration) || 5,
            passage: type === "transcription" ? passage : undefined,
            audioUrl,
            category,
            tags: tags ? tags.split(",") : [],
            createdBy: req.user.id,
        });

        res.json({ message: "Test created ✅", test });

    } catch (error) {
        console.log("CREATE ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ================= GET ALL =================
exports.getTests = async (req, res) => {
    try {
        const tests = await Test.find().sort({ createdAt: -1 });
        res.json(tests);
    } catch (error) {
        console.log("GET TESTS ERROR:", error);
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
=======
const Test = require("../models/test");
const cloudinary = require("../config/cloudinary");

// ================= CREATE TEST =================
exports.createTest = async (req, res) => {
    try {
        const { title, type, duration, passage, category, tags } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Missing title" });
        }

        let audioUrl = "";

        // CLOUDINARY UPLOAD
        if (type === "dictation") {
            if (!req.file) {
                return res.status(400).json({ message: "Audio required" });
            }

            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "video"
            });

            audioUrl = result.secure_url;
        }

        const test = await Test.create({
            title,
            type,
            duration: Number(duration) || 5,
            passage: type === "transcription" ? passage : undefined,
            audioUrl,
            category,
            tags: tags ? tags.split(",") : [],
            createdBy: req.user.id,
        });

        res.json({ message: "Test created ✅", test });

    } catch (error) {
        console.log("CREATE ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ================= GET ALL =================
exports.getTests = async (req, res) => {
    try {
        const tests = await Test.find().sort({ createdAt: -1 });
        res.json(tests);
    } catch (error) {
        console.log("GET TESTS ERROR:", error);
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
>>>>>>> d6c1bf3 (Complete MERN setup: backend APIs, MongoDB integration, authentication, admin dashboard, frontend pages, and bug fixes)
};