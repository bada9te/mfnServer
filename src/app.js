const fs = require('fs');
const path = require('path');
const cors = require('cors');
//const helmet = require('helmet');
//const morgan = require('morgan');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cronTasks = require('./utils/cron/cron');
const initPassportStarategies = require('./utils/passport/passport');
const initMulter = require('./utils/multer/multer');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const initAudioStreamer = require('./utils/audio-streamer/audioStreamer');
const launchApolloServer = require('./utils/apollo-server/apollo-server');
const envCheck = require('./utils/env-check/env-check');
require('dotenv').config();


console.log('[APP] Launching...');

// check env
envCheck([
  "CLIENT_BASE",
  "SESSION_SECRET",
  "COOKIE_ACCESS_1",
  "COOKIE_ACCESS_2",
  "MONGO_URL"
]);

// app config
const config = {
    COOKIE_ACCESS_1: process.env.COOKIE_ACCESS_1,
    COOKIE_ACCESS_2: process.env.COOKIE_ACCESS_2,
    CLIENT_BASE:     process.env.CLIENT_BASE,
    SESSION_SECRET:  process.env.SESSION_SECRET,
};


// ########################### BASE ###########################
// express app
const app = express();

// cors
const whitelist = [...config.CLIENT_BASE.split(', '), 'https://studio.apollographql.com'];
app.use(cors({
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}));

// cookie 
app.use(cookieParser());

// enable json
app.use(express.json());



// #################### AUTH SESSION + PASSPORT #################
// session

app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));


// passport init
app.use(passport.initialize());
app.use(passport.session());
initPassportStarategies(passport, app);



// ############################ CRON ############################
// cron jobs
cronTasks.initDefaultCronTasks();



// ######################## AUDIO_STREAM ########################
// audio streamer
initAudioStreamer(app);



// #################### MULTER - FILE_UPLOAD ####################
// file upload
initMulter(app);



// ########################## REST API ##########################
// battles routes
app.use('/api/battles', require('./routers/battles.router'));

// posts routes
app.use('/api/posts', require('./routers/posts.router'));

// users routes
app.use('/api/users', require('./routers/users.router'));

// comments routes
app.use('/api/comments', require('./routers/comments.router'));

// notifications routes
app.use('/api/notifications', require('./routers/notifications.router'));

// reports routes
app.use('/api/reports', require('./routers/reports.router'));

// reports routes
app.use('/api/moderation', require('./routers/moderation.router'));

// support requests routes
app.use('/api/support-requests', require('./routers/support-requests.router'));

// playlists
app.use('/api/playlists', require('./routers/playlists.router'));

// files
app.use('/api/uploads/images', express.static(path.join(__dirname, '..', 'uploads', 'images')));
app.use('/api/uploads/audios', express.static(path.join(__dirname, '..', 'uploads', 'audios')));
app.use('/api/uploads/others', express.static(path.join(__dirname, '..', 'uploads', 'others')));



// ########################## GRAPHQL ###########################
launchApolloServer(app);


// error handler
app.use(errorHandler);


module.exports = app;
