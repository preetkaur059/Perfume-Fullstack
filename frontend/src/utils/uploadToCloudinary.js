import axios from "axios";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Uploads an image directly to Cloudinary using an unsigned upload preset.
 * This intentionally does not use the application's Axios client, because the
 * request must go to Cloudinary rather than the API base URL.
 */
const uploadToCloudinary = async (file) => {
  if (!file) {
    throw new Error("Please select an image");
  }

  if (!file.type?.startsWith("image/")) {
    throw new Error("Invalid image type. Please select an image file");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Image must be 5 MB or smaller");
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Add the cloud name and upload preset to frontend/.env",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
    );

    if (!data.secure_url) {
      throw new Error("Cloudinary did not return an image URL");
    }

    return data.secure_url;
  } catch (error) {
    const cloudinaryMessage = error.response?.data?.error?.message;
    throw new Error(cloudinaryMessage || error.message || "Failed to upload image");
  }
};

export default uploadToCloudinary;
