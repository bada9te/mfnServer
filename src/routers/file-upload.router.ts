import express from 'express';
import { upload, multi_upload } from '../middleware/multer';
import multer from 'multer';

const fileUploadRouter = express.Router();


// one input file upload route
fileUploadRouter.post('/upload-single', upload.single('file'), (req, res, next) => {
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
fileUploadRouter.post('/upload-multiple', (req, res) => {
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
        res.status(201).json({
            done: true,
            files: req.files,
        });
    });
});


module.exports = fileUploadRouter;