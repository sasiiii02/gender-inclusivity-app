import streamifier from "streamifier";
import cloudinary from "../../config/cloudinary.js";

export const uploadCourseImage = (fileBuffer, originalFilename) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "gender-inclusivity/courses/images",
        resource_type: "image",
        use_filename: true,
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

