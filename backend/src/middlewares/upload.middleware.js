import multer from "multer";
import path from "path";

// 1. Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save files to the "uploads" directory
    cb(null, "uploads/");
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