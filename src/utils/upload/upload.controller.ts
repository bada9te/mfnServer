import { Controller, Get, HttpStatus, Param, ParseFilePipeBuilder, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, uploadFileFilter } from './upload.utils';
import { Response } from 'express';

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
                .addFileTypeValidator({ fileType: 'jpeg' })
                .addMaxSizeValidator({ maxSize: 4000 })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
                })
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


    @Get(':imagename')
    getImage(@Param('imagename') image, @Res() res: Response) {
        const response = res.sendFile(image, { root: './uploads' });
        return {
            status: HttpStatus.OK,
            data: response,
        }
    }
}

