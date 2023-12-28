const fs = require('fs');
const app = require('./app');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const initSocketIO = require('./utils/socket/socket');
const removeJunkFiles = require('./utils/cleaner/cleaner');
const config = require('./config');


// server config
const PORT      = config.base.port || 8000;
const MONGO_URL = config.mongo.url;
const MONGO_URL_TEST = config.mongo.url_test;


// http server
const SERVER = http.createServer(app);

// socket.io
initSocketIO(SERVER);


// prepare and launch server
const launchServer = async() => {
    // create a bunch of folders
    const uploadsTypes = ['audios', 'images', 'others'];
    const uploadsPath = path.join(__dirname, '..', 'uploads');
    createFolderAtPathIfNotExists(uploadsPath);

    uploadsTypes.forEach(type => {
        createFolderAtPathIfNotExists(path.join(uploadsPath, type));
    });

    // prepare mongoose events
    mongoose.connection.once('open', () => {
        console.log('[DB] MongoDB connection established.')
    });
    mongoose.connection.on('error', (err) => {
        console.error(`[DB] ${err}`);
    });

    console.log(`[DB] Connecting...`)
    // connect mongo
    await mongoose.connect(config.base.envType !== "test" ? MONGO_URL : MONGO_URL_TEST).catch(console.error);

    // clean junk
    await removeJunkFiles();

    // run server
    if (process.env.ENV_TYPE !== 'test') {
        SERVER.listen(PORT, () => {
            console.log(`[APP] Server is running on port ${PORT}...`);
        });
    }
}

// create folder at path 
const createFolderAtPathIfNotExists = (targetPath) => {
    if (!fs.existsSync(targetPath)) {
        console.log(`[FILESYSTEM] Creating folder at: ${targetPath}...`);
        fs.mkdirSync(targetPath);
        console.log(`[FILESYSTEM] ${targetPath} created.`);
    }
}

// launch 
launchServer();