import api from "@/api/client";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Uploads an image via the backend signed Cloudinary upload endpoint.
 * The backend uses Multer to handle the file upload and securely signs the request with Cloudinary.
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

  const formData = new FormData();
  formData.append("image", file);

  try {
    const { data } = await api.post("/products/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!data.imageUrl) {
      throw new Error("Server did not return an image URL");
    }

    return data.imageUrl;
  } catch (error) {
    const serverMessage = error.response?.data?.message;
    throw new Error(serverMessage || error.message || "Failed to upload image");
  }
};

export default uploadToCloudinary;
