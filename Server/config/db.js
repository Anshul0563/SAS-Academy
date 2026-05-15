const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("Connecting to DB...");

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");
    } catch (error) {
        console.error("DB error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
