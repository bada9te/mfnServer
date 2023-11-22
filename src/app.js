const path         = require('path');
const cors         = require('cors');
const express      = require('express');
const passport     = require('passport');
const session      = require('express-session');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const config       = require('./config');
const flash        = require('connect-flash');


console.log('[APP] Launching...');




// ########################### BASE ###########################
  // app config
  const CLIENT_BASE    = config.base.clientBase;
  const SESSION_SECRET = config.base.sessionSecret

  // express app
  const app = express();

  // cors
  const whitelist = [...CLIENT_BASE.split(', '), 'https://studio.apollographql.com'];
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

  // use connect-flash for flash messages stored in session
  app.use(flash());


// ######################## AUTH SESSION ########################
  // session
  app.use(session({
      secret: SESSION_SECRET,
      rolling: true,
      resave: true, 
      saveUninitialized: false,
      cookie: { maxAge: 24 * 60 * 60 * 1000 }
  }));


// ########################## PASSPORT ##########################
  // passport init
  app.use(passport.initialize());
  app.use(passport.session());
  require('./utils/passport/passport')(passport);


// ############################ CRON ############################
  // cron jobs
  require('./utils/cron/cron').initDefaultCronTasks();

  
// ######################## AUDIO_STREAM ########################
  // audio streamer
  require('./utils/audio-streamer/audioStreamer')(app);


// #################### MULTER - FILE_UPLOAD ####################
  // file upload
  require('./utils/multer/multer')(app);


// ########################## REST API ##########################
  // auth routes
  app.use(require('./routers/auth.router'));

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


// ########################### FILES ############################
// files
  app.use('/api/uploads/images', express.static(path.join(__dirname, '..', 'uploads', 'images')));
  app.use('/api/uploads/audios', express.static(path.join(__dirname, '..', 'uploads', 'audios')));
  app.use('/api/uploads/others', express.static(path.join(__dirname, '..', 'uploads', 'others')));


// ########################## GRAPHQL ###########################
  require('./utils/apollo-server/apollo-server')(app);


// error handler
  //app.use(errorHandler);


module.exports = app;
