import { Controller, Get, HttpStatus, Param, ParseFilePipeBuilder, Post, Res, StreamableFile, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, uploadFileFilter } from './upload.utils';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { extname, join } from 'path';

@Controller('files')
export class UploadController {

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: editFileName,
        }),
        fileFilter: uploadFileFilter,
    }))
    uploadFile(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addMaxSizeValidator({ maxSize: 4096, message: "File size must be less then 4MB" })
                .build()
        ) 
        file: Express.Multer.File
    ) {
        const response = {
            originalname: file.originalname,
            filename: file.filename,
        };
        return {
            status: HttpStatus.OK,
            message: 'Uploaded.',
            data: response,
        }
    }

    @Post('upload-multiple')
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: diskStorage({
            destination: './uplaods',
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


    @Get(':filename')
    getImage(@Param('filename') fileName, @Res() res: Response) {
        const filePath = join(process.cwd(), 'uploads', fileName);
        const file = createReadStream(filePath);
        file.pipe(res);
    }

}

