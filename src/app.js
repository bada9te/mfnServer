const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cronTasks = require('./utils/cron/cron');
const initFrontend = require('./utils/frontend/frontend');
const initPassportStarategies = require('./middleware/passport');
const initMulter = require('./middleware/multer');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const initAudioStreamer = require('./utils/audio-streamer/audioStreamer');
const launchApolloServer = require('./middleware/apollo-graphql');
require('dotenv').config();



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
app.use(cors({
  origin: config.CLIENT_BASE.split(', '),
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



// ########################## FRONTEND ##########################
// frontend
initFrontend(app);



// ########################## REST API ##########################
// battles routes
app.use('/api/battles', require('./routers/battles/battles.router'));

// posts routes
app.use('/api/posts', require('./routers/posts/posts.router'));

// users routes
app.use('/api/users', require('./routers/users/users.router'));

// comments routes
app.use('/api/comments', require('./routers/comments/comments.router'));

// notifications routes
app.use('/api/notifications', require('./routers/notifications/notifications.router'));

// reports routes
app.use('/api/reports', require('./routers/reports/reports.router'));

// reports routes
app.use('/api/moderation', require('./routers/moderation/moderation.router'));

// support requests routes
app.use('/api/support-requests', require('./routers/support-requests/reports.router'));

// playlists
app.use('/api/playlists', require('./routers/playlists/playlists.router'));

// files
app.use('/api/uploads/images', express.static(path.join(__dirname, '..', 'uploads', 'images')));
app.use('/api/uploads/audios', express.static(path.join(__dirname, '..', 'uploads', 'audios')));
app.use('/api/uploads/others', express.static(path.join(__dirname, '..', 'uploads', 'others')));



// ########################## GRAPHQL ###########################
launchApolloServer(app);


// error handler
app.use(errorHandler);


module.exports = app;
