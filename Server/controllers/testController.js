const Test = require("../models/test");

// ✅ CREATE TEST
exports.createTest = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file); // 🔥 DEBUG

        const { title, type, duration, passage, category, tags } = req.body;

        if (!title || !duration) {
            return res.status(400).json({ message: "Missing title or duration" });
        }

        if (type === "transcription" && !passage) {
            return res.status(400).json({ message: "Passage required" });
        }

        if (type === "dictation" && !req.file) {
            return res.status(400).json({ message: "Audio required" });
        }

        const test = await Test.create({
            title,
            type,
            duration: Number(duration),

            // ✅ TRANSCRIPTION
            passage: type === "transcription" ? passage : undefined,

            // ✅ DICTATION AUDIO FIX (IMPORTANT)
            audioUrl:
                type === "dictation"
                    ? req.file.path.replace(/\\/g, "/")
                    : undefined,

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

// ✅ GET ALL
exports.getTests = async (req, res) => {
    try {
        const tests = await Test.find().sort({ createdAt: -1 });
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ GET BY ID
exports.getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }
        res.json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};