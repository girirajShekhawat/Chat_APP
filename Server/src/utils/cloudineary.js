import {v2 as cloudinary} from 'cloudinary';
 import fs from "fs";
 
 
cloudinary.config({ 
  cloud_name: process.env.CLOUDINEARY_NAME, 
  api_key: process.env.CLOUDINEARY_API_KEY , 
  api_key: process.env.CLOUDINEARY_API_KEY , 
  api_secret:process.env.CLOUDINEARY_SECRET_KEY,
});





// this will upload the file on the cloudinary 
async function uploadOnCloud(filePath ){

try {
  if(!filePath) return null;
  // upload the file 
 const response=await  cloudinary.uploader.upload(filePath,{
  resource_type:'auto'
 });
 
 console.log("file has been uploaded on the cloudeniary",response)
    
 return response.url;

} catch (error) {
  console.log("Error in uploading the file on cloudeniary")
  fs.unlinkSync(filePath);
  return null;
}

}





export default uploadOnCloud;











 