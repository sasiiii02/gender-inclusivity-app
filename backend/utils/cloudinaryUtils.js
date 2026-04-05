import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

/**
 * Uploads a PDF buffer to Cloudinary lesson pdfs folder.
 * 
 * @param {Buffer} fileBuffer - The buffer of the PDF file to upload.
 * @param {string} originalFilename - The original name of the uploaded file.
 * @returns {Promise<Object>} - The standardized upload result data containing secure_url, public_id, resource_type, bytes, format, original_filename.
 */
export const uploadPdfToCloudinary = (fileBuffer, originalFilename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "gender-inclusivity/lessons/pdfs",
        resource_type: "auto", // 'auto' allows Cloudinary to index PDFs as images, showing them on the dashboard explicitly!
        use_filename: true,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload utility error:", error);
          return reject(error);
        }

        // Return only the important data as requested
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
          bytes: result.bytes,
          format: result.format,
          original_filename: originalFilename,
        });
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Deletes a file from Cloudinary using its public_id.
 * 
 * @param {string} publicId - The Cloudinary public_id of the file to delete.
 * @returns {Promise<Object>} - The deletion response from Cloudinary.
 */
export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    // Determine the resource_type explicitly to destroy either legacy raw files or new auto/image files
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType, 
    });
    return result;
  } catch (error) {
    console.error("Cloudinary deletion utility error:", error);
    throw error;
  }
};
