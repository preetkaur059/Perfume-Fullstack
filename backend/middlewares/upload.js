import multer from "multer";

// Use memory storage so file is kept as buffer in memory
const storage = multer.memoryStorage();

// Accept only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only image files are allowed."), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

// Middleware to handle single image upload with user-friendly errors
export const uploadImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Image must be 5 MB or smaller",
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Failed to upload image",
      });
    }

    next();
  });
};

export default upload;
