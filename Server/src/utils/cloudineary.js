import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINEARY_NAME, 
  api_key: process.env.CLOUDINEARY_API_KEY , 
  api_key: process.env.CLOUDINEARY_API_KEY , 
  api_secret:process.env.CLOUDINEARY_SECRET_KEY,
});