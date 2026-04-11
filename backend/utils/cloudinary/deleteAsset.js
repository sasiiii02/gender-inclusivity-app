import cloudinary from "../../config/cloudinary.js";

export const deleteCloudinaryAsset = async (publicId, resourceType) => {
  if (!publicId) return null;

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType || "image",
  });

  return result;
};

