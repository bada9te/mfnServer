const fs     = require('fs');
const app    = require('./app');
const path   = require('path');
const http   = require('http');
const config = require('./config');
const removeJunkFiles       = require('./utils/cleaner/cleaner');
const connectMongo          = require('./utils/mongo/connectMongo');
const setupApollo           = require('./utils/apollo-server/server');


// server config
const PORT           = config.base.port || 8000;
const MONGO_URL      = config.mongo.url;
const MONGO_URL_TEST = config.mongo.url_test;


// http server
const SERVER = http.createServer(app);


// prepare and launch server
const launchServer = async() => {
    connectMongo();
    setupApollo(app, SERVER);

    // create a bunch of folders
    const uploadsTypes = ['audios', 'images', 'others'];
    const uploadsPath = path.join(__dirname, '..', 'uploads');
    createFolderAtPathIfNotExists(uploadsPath);
    
    uploadsTypes.forEach(type => {
        createFolderAtPathIfNotExists(path.join(uploadsPath, type));
    });
    
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
