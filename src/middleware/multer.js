const multer = require('multer');
const path = require('path');


const imageExtensions = ['.jpg', '.jpeg', '.png'];
const audioExtensions = ['.wav', '.mp3'];


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
        callBack(null, Date.now() + file.originalname)
    },
    
});


// filter
const fileFilter = (req, file, callBack) => {
    /*
    const extension = path.extname(file.originalname);
    if (![...audioExtensions, ...imageExtensions, ].includes(extension)) {
        return callBack(new Error('This type of file is not allowed'));
    }
    */
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

    
module.exports = { multi_upload, upload };
