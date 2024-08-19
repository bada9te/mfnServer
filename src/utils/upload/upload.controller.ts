import { Controller, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, ParseFilePipeBuilder, Post, Res, StreamableFile, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, uploadFileFilter } from './upload.utils';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import path, { join } from 'path';
import { SharpPipe } from './sharp.pipe';
import { FFMpegPipe } from './ffmpeg.pipe';


@Controller('files')
export class UploadController {
    @Post('upload-image')
    @UseInterceptors(FileInterceptor('file'))
    uploadImageFile(@UploadedFile(
        SharpPipe
    ) filename: string) {
        const response = {
            filename,
        };
        return {
            status: HttpStatus.OK,
            message: 'Uploaded.',
            data: response,
        }
    }

    @Post('upload-audio')
    @UseInterceptors(FileInterceptor('file'))
    uploadAudioFile(@UploadedFile(
        FFMpegPipe
    ) file: Express.Multer.File) {
        const response = {
            filename: file.filename,
        };
        return {
            status: HttpStatus.OK,
            message: 'Uploaded.',
            data: response,
        }
    }


    /*
    @Post('upload-multiple')
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: diskStorage({
            destination: './uploads',
            filename: editFileName,
        }),
        fileFilter: uploadFileFilter,
    }))
    uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
        const response = [];
        files.forEach(file => {
            const fileReponse = {
                originalname: file.originalname,
                filename: file.filename,
            };
            response.push(fileReponse);
        });
        return {
            status: HttpStatus.OK,
            message: 'Uploaded.',
            data: response,
        };
    }
    */


    @Get(':filename')
    getImage(@Param('filename') fileName, @Res() res: Response) {
        try {
            const filePath = join(process.cwd(), 'uploads', fileName);
            if (!existsSync(filePath)) {
                throw new Error();
            }
            const file = createReadStream(filePath);
            file.pipe(res);
        } catch (error) {
            return res.status(404);
        }
    }

}

