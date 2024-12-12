// lib/cloudinary.js (JavaScript backend)
import cloudinary from 'cloudinary';  // Ensure you're using the default import

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = (filePath) => {
  return cloudinary.v2.uploader.upload(filePath, {
    folder: 'bonkcomichub',
  });
};
