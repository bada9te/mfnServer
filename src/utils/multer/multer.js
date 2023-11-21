const multer = require('multer');
const path = require('path');


const imageExtensions = ['.jpg', '.jpeg', '.png'];
const audioExtensions = ['.wav', '.mp3'];


module.exports = (app) => {
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
    }).array('uploadedFiles')


    // single upload
    let upload = multer({ storage, fileFilter });


    // one input file upload route
    app.post('/api/upload-single', upload.single('file'), (req, res, next) => {
        const file = req.file;

        if (!file) {
            const error = new Error('No File');
            return res.status(400).json({
                done: false,
                error: error.message,
            });
        }
        
        res.status(201).json({
            done: true,
            file: file,
        });
    });

    
    // multi-inputs file upload
    app.post('/api/upload-multiple', (req, res) => {
        multi_upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                res.status(500).send({ error: { message: `Multer uploading error: ${err.message}` } }).end();
                return;
            } else if (err) {
                // An unknown error occurred when uploading.
                if (err.name == 'ExtensionError') {
                    res.status(413).send({ error: { message: err.message } }).end();
                } else {
                    res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
                }
                return;
            }
    
            // Everything went fine.
            // show file `req.files`
            // show body `req.body`
            res.status(201).json({
                done: true,
                files: req.files,
            });
        })
    });
}
