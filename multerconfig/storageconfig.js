const multer = require("multer");

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads"); // Destination folder for uploaded files
    },
    filename: (req, file, callback) => {
        const filename = `image-${Date.now()}.${file.originalname}`;
        callback(null, filename); // File name callback
    }
});

// File filter function
const fileFilter = (req, file, callback) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        callback(null, true); // Accept file
    } else {
        callback(new Error("Only jpg, png, jpeg format are allowed"), false); // Reject file
    }
};

// Multer upload configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;
