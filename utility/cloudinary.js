import cloudinary from 'cloudinary';
import datauri from './data.uri.js';
import { API_SECRET, API_KEY, CLOUD_NAME, SECURE } from '../configuration/configuration.js';


// Setting The Cloudinary Configurations


// export const cloudinaryConfig = {
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
//   secure: SECURE,

// }

const cloudConfig = cloudinary.v2.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: SECURE
})

export const uploads = async (body, folder) => {
    // const dataUri = datauri(body);
    // console.log(dataUri);
    return cloudinary.v2.uploader.upload(body.image,{resource_type: 'auto', 
    use_filename: true,
    folder: folder})
    .then(result => {
        return result
    }).catch(err => {
        return err
    })
}

export const multiUpload = async(body, folder) => {
    const dataUri = datauri(body);
   return cloudinary.v2.uploader.upload(dataUri.content, {resource_type: 'auto', 
   use_filename: true, unique_filename: true,
   folder: folder}, function (err, result) {
       if(err) return err
       return result
   })
}


export const deleteImage = async(public_id) => {
    return cloudinary.v2.uploader.destroy(public_id, function(err, data) {
        if(err) return err;
    }) 
}
 
