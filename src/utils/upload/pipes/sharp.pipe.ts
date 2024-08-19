import { Injectable, PipeTransform } from "@nestjs/common";
import { join, parse } from "path";
import * as sharp from 'sharp';

@Injectable()
export class SharpPipe implements PipeTransform<Express.Multer.File, Promise<string>> {
    async transform(file: Express.Multer.File): Promise<string> {
        const origName = parse(file.originalname).name;
        const filename = Date.now() + '-' + origName + '.webp';

        await sharp(file.buffer)
            .resize(800)
            .webp({ effort: 3 })
            .toFile(join('uploads', filename));

        return filename;
    }
}