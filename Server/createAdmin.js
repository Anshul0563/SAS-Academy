const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/user");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB Connected");

    const email = "anshulshskya9@gmail.com";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Jarvis@563", 10);

    const admin = new User({
      name: "Admin",
      email: email,
      password: hashedPassword,
      role: "admin",
      isActive: true
    });

    await admin.save();

    console.log("✅ Admin created successfully");
    console.log("Email: anshulshskya9@gmail.com");
    console.log("Password: Jarvis@563");

    process.exit();

  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

createAdmin();