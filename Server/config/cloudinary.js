// config/cloudinary.js
const cloudinary = require("cloudinary").v2;

// Cloudinary v2 config - Standard env vars
// Ensure Server/.env has: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const requiredKeys = [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET"
];

const getMissingCloudinaryKeys = () => requiredKeys.filter((key) => !process.env[key]);

const assertCloudinaryConfig = () => {
    const missing = getMissingCloudinaryKeys();
    if (missing.length > 0) {
        const error = new Error(`Cloudinary is not configured. Missing: ${missing.join(", ")}`);
        error.statusCode = 500;
        throw error;
    }
};

const missing = getMissingCloudinaryKeys();
if (missing.length > 0) {
    console.warn(`Cloudinary config missing: ${missing.join(", ")}`);
}


module.exports = cloudinary;
module.exports.assertCloudinaryConfig = assertCloudinaryConfig;
