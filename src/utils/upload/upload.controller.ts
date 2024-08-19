import { Controller, Get, HttpStatus, Inject, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream, existsSync, unlinkSync } from 'fs';
import * as path from 'path';
import { SharpPipe } from './pipes/sharp.pipe';
import { MinioService } from 'nestjs-minio-client';
import { diskStorage } from 'multer';
import { editFileName, uploadFileFilter } from './upload.utils';


@Controller('files')
export class UploadController {
    constructor (private readonly minioService: MinioService) {}


    @Post('upload-image')
    @UseInterceptors(FileInterceptor('file'))
    uploadImageFile(@UploadedFile(
        SharpPipe
    ) filename: string) {
        const response = {
            filename,
        };

        const target = path.join(__dirname, "..", "..", "..", "uploads", filename);

        this.minioService.client.fPutObject(
            "images",
            filename,
            target,
        );

        unlinkSync(target);

        return {
            status: HttpStatus.OK,
            message: 'Uploaded.',
            data: response,
        }
    }

    @Post('upload-audio')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: editFileName,
        }),
        fileFilter: uploadFileFilter,
    }))
    uploadAudioFile(@UploadedFile() file: Express.Multer.File) {
        const response = {
            filename: file.filename,
        };

        const target = path.join(__dirname, "..", "..", "..", "uploads", response.filename);

        this.minioService.client.fPutObject(
            "audios",
            response.filename,
            target,
        );

        unlinkSync(target);

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


    @Get(':bucket/:filename')
    async getImage(
        @Param('filename') fileName: string, 
        @Param('bucket') bucket: string,
        @Res() res: Response
    ) {
        try {
            const readableStream = await this.minioService.client.getObject(
                bucket,
                fileName,
            );

            readableStream.pipe(res);
        } catch (error) {
            return res.status(404);
        }
    }

}

