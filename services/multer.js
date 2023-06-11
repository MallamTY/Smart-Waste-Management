
import multer from "multer";

const storage = multer.memoryStorage();

const filefilter= (req, file, callback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' 
        || file.mimetype === 'application/pdf' || file.mimetype === 'audio/mpeg'|| file.mimetype === 'video/mp4' ){
        callback(null, true)
    }

    else{
        callback(null, false)
    }
}
export const multerUploads = multer({ storage, fileFilter: filefilter }).single('image');

export const multiMulterUploads = multer({storage}).any();


