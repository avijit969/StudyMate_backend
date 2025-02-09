import { v2 as cloudinary, v2 } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded succesfully
    console.log("flie is uploaded on cloudinary", response.url);
    fs.unlinkSync(localFilePath); // remove the locally temporarily saved file
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally temporarily saved file
  }
};

function extractPublicId(cloudinaryUrl) {
  const regex = /\/upload\/(?:v\d+\/)?([^/.]+)(?:\.[\w]+)?$/;
  const match = cloudinaryUrl.match(regex);
  return match ? match[1] : null;
}
const deleteImageByPublicId = (url, type) => {
  v2.api.delete_resources(extractPublicId(url), { type: "upload", resource_type: type }, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      console.log(result);
    }
  });
}

export { uploadOnCloudinary, deleteImageByPublicId } 
