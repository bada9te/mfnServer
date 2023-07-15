const app = require('./app');
const http = require('http');
const mongoose = require('mongoose');
const initSocketIO = require('./socket/socket');
const removeJunkFiles = require('./utils/cleaner/cleaner');
require('dotenv').config();



// server config
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;


// http server
const SERVER = http.createServer(app);


// socket.io
initSocketIO(SERVER);

// prepare and launch server
const launchServer = async() => {
    console.log('[APP] Launching...');
    
    // prepare mongoose events
    mongoose.connection.once('open', () => {
        console.log('[DB] MongoDB connection opened.')
    });
    mongoose.connection.on('error', (err) => {
        console.error(`[DB] ${err}`);
    });

    // connect mongo
    await mongoose.connect(MONGO_URL);

    // clean junk
    await removeJunkFiles();

    // run server
    SERVER.listen(PORT, () => {
        console.log(`[APP] Server is running on port ${PORT}...`);
    });
}

// launch 
launchServer();