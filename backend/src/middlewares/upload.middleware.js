import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Resolving the absolute path since we are in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The directory will be backend/uploads (this file is inside backend/src/middlewares)
const uploadDir = path.join(__dirname, '../../uploads');

// Ensure the uploads directory exists before saving files
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 1. Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save files to the dynamically resolved uploads directory
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique file name to avoid overwriting: timestamp-randomNum-originalName
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

// 2. File Filter (Accept only images)
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|webp/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png, webp) are allowed!"), false);
  }
};

// 3. Initialize Multer
export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});