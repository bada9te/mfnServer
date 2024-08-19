import { BadRequestException } from "@nestjs/common";
import { extname } from "path";


export const uploadFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|mp3|wav)$/)) {
        return callback(
            new BadRequestException("File filter not passed."),
            false,
        );
    }
    callback(null, true);
};


export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    
    callback(null, `${Date.now()}-${name}${fileExtName}`);
};