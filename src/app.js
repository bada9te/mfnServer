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
const config = require('./config');


console.log('[APP] Launching...');



// app config
const appConfig = {
  //COOKIE_ACCESS_1: config.base.cookieAccess1,
  //COOKIE_ACCESS_2: config.base.cookieAccess2,
  CLIENT_BASE:     config.base.clientBase,
  SESSION_SECRET:  config.base.sessionSecret,
};


// ########################### BASE ###########################
// express app
const app = express();

// cors
const whitelist = [...appConfig.CLIENT_BASE.split(', '), 'https://studio.apollographql.com'];
console.log(`[CORS] Origins in whitelist: `, whitelist)
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
    secret: appConfig.SESSION_SECRET,
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
