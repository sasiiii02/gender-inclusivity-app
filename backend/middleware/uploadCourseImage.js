import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const ALLOWED_IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const isAllowed =
    ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype) && ALLOWED_IMAGE_EXTS.has(ext);

  if (!isAllowed) {
    return cb(
      new Error("Invalid file type. Only jpg, jpeg, png, and webp are allowed."),
      false
    );
  }

  return cb(null, true);
};

const uploadCourseImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default uploadCourseImage;

