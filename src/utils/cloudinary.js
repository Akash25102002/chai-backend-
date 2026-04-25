import {v2 as cloudinary} from "cloudinary";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadVideoToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "video",
            folder: "chai-backend/videos",
        });
        return result.secure_url;
    } catch (error) {
        fs.unlinkSync(filePath);
        throw error;
    }
};

// cloudinary.v2.uploader.upload("path/to/video.mp4", {
//     resource_type: "video",
//     folder: "chai-backend/videos",
// });

export {uploadVideoToCloudinary as uploadcloudinary};  
import fs from "fs";