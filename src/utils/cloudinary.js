import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploaOnCloudinary = async (LocalFilePath) =>{
    try {
        if(!LocalFilePath) return null;

        const response = await cloudinary.uploader.upload(LocalFilePath, {
            resource_type: 'auto'
        })

        console.log("file uploaded on cloudinary", response.url);

        return response;
        
    } catch (error) {
        fs.unlinkSync(LocalFilePath)    //for safe cleaning purpose always remove un-uploaded file from local storage   
        console.log('upload on cloudinary error')
        return null;
    }
}

export {uploaOnCloudinary}