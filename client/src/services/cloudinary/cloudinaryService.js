import { CLOUDINARY_CONFIG } from '../../config/cloudinary';

export const cloudinaryService = {
  uploadAudio: async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
    formData.append("resource_type", CLOUDINARY_CONFIG.resourceType);

    const response = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return response.json();
  }
}; 