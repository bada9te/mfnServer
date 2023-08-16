const fs = require("fs");
const path = require("path");


const initAudioStreamer = (app) => {
    app.get('/api/uploads/audios/:file', (req, res) => {
        const audioFileName = req.params.file;

        const audioPath = path.join(__dirname, '..', '..', '..', 'uploads', 'audios', audioFileName);
        console.log(audioPath)

        const audioStat = fs.statSync(audioPath);

        const audioSize = audioStat.size;

        const audioRange = req.headers.range;

        if (audioRange) {
            const parts = audioRange.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);

            const end = parts[1] ? parseInt(parts[1], 10) : audioSize-1;

            const chunksize = (end-start) + 1;

            const file = fs.createReadStream(audioPath, {start, end});

            const header = {
                'Content-Range': `bytes ${start}-${end}/${audioSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'audio/mp3',
            };

            console.log(header)

            res.writeHead(206, header);
            file.pipe(res);
        } else {
            const header = {
                'Content-Length': audioSize,
                'Content-Type': 'audio/mp3',
            };

            console.log(header)

            res.writeHead(206, header);
            fs.createReadStream(audioPath).pipe(res);
        }
    });
}


module.exports = initAudioStreamer;