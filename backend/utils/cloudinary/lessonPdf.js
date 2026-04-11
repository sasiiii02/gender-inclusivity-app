import streamifier from "streamifier";
import path from "path";
import cloudinary from "../../config/cloudinary.js";

const assertPdfBuffer = (fileBuffer) => {
  if (!fileBuffer || fileBuffer.length < 5) return false;
  return fileBuffer.slice(0, 5).toString("ascii") === "%PDF-";
};

const toCloudinaryPublicId = (filename) => {
  const parsed = path.parse(filename || "lesson.pdf");
  const baseName =
    parsed.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "") || "lesson";
  const extension = (parsed.ext || ".pdf").toLowerCase();

  return `${baseName}${extension}`;
};

export const uploadLessonPdf = (fileBuffer, originalFilename) =>
  new Promise((resolve, reject) => {
    const sanitizedFilename = path.basename(originalFilename || "lesson.pdf");
    if (!assertPdfBuffer(fileBuffer)) {
      return reject(new Error("Invalid PDF file content."));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "gender-inclusivity/lessons/pdfs",
        resource_type: "raw",
        use_filename: true,
        unique_filename: true,
        public_id: toCloudinaryPublicId(sanitizedFilename),
        filename_override: sanitizedFilename,
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
          format: result.format,
          bytes: result.bytes,
          original_filename: originalFilename,
        });
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });

