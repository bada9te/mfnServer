import multer from 'multer';
import path from 'path';
import config from '../config';
import express from "express";


const imageExtensions: string[] = ['.jpg', '.jpeg', '.png'];
const audioExtensions: string[] = ['.wav', '.mp3'];
const MONGO_PREFIX = config.mongo.prefix;

// storage
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        const extension = path.extname(file.originalname);

        let destPath = 'uploads/';
        if (imageExtensions.includes(extension)) {
            destPath += 'images/';
        } else if (audioExtensions.includes(extension)) {
            destPath += 'audios/';
        } else {
            destPath += 'others/';
        }

        callBack(null, destPath);
    },
    filename: (req, file, callBack) => {
        callBack(null, MONGO_PREFIX + Date.now() + file.originalname)
    },
});


// filter
const fileFilter = (req: express.Request, file: Express.Multer.File, callBack: multer.FileFilterCallback) => {
    const extension = path.extname(file.originalname);
    if (![ ...audioExtensions, ...imageExtensions ].includes(extension)) {
        return callBack(new Error('This type of file is not allowed'));
    }
    
    if (file.size > 8388608) {
        return callBack(new Error('File size exceeds 8 MB'));
    }
    callBack(null, true);
}


// multiple upload
const multi_upload = multer({
    storage,
    //limits: { fileSize: 1 * 8128 * 8128 }, // 1MB
    fileFilter
}).array('uploadedFiles');


// single upload
let upload = multer({ storage, fileFilter });

    
export default { multi_upload, upload };
