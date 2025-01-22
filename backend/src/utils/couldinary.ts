import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY 
});


const uploadOnCloudinary = async (localFilePath: string): Promise<UploadApiResponse | null> => {
    try {
        if (!localFilePath) return null; 

        const response: UploadApiResponse = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        
        fs.unlinkSync(localFilePath);
        return response;
    } catch (err) {
        
        fs.unlinkSync(localFilePath);
        console.log("Cloudinary upload error: ", err);
        return null; 
    }
}

export { uploadOnCloudinary };