// config/cloudinary.js
const cloudinary = require("cloudinary").v2;

// Cloudinary v2 config - Standard env vars
// Ensure Server/.env has: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate config on startup
const validateConfig = () => {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
        console.warn('⚠️  CLOUDINARY_CLOUD_NAME missing in .env');
    }
    if (!process.env.CLOUDINARY_API_KEY) {
        console.warn('⚠️  CLOUDINARY_API_KEY missing in .env'); 
    }
    if (!process.env.CLOUDINARY_API_SECRET) {
        console.warn('⚠️  CLOUDINARY_API_SECRET missing in .env');
    }
};

validateConfig();


module.exports = cloudinary;