const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/user");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin" // 🔥 IMPORTANT
    });

    await admin.save();

    console.log("Admin created successfully ✅");
    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();