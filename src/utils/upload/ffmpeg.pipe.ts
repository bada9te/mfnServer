import { Injectable, PipeTransform } from "@nestjs/common";
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require("fluent-ffmpeg");
//import ffmpegStatic from "ffmpeg-static";
import { Readable } from "stream";
ffmpeg.setFfmpegPath(ffmpegPath);

@Injectable()
export class FFMpegPipe implements PipeTransform<Express.Multer.File, Promise<string>> {
    async transform(file: Express.Multer.File): Promise<string> {
        const fileStream = file.stream || Readable.from(file.buffer);

        ffmpeg()
            .input(fileStream)
            .audioFrequency(16000)
            .audioChannels(1)
            .audioCodec("pcm_s16le")
            .output(`././outputAudio/converted.wav`)
            .on("end", async () => {
                console.log("Conversion finished");
            })
            .on("error", (err) => {
                console.error("Error:", err);
            })
            .run();
            
        return "test data audio"
    }
}