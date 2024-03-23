import path from 'path';
import cors from 'cors';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import config from './config';
const MongoDBStore = require('connect-mongodb-session')(session);


console.log('[APP] Launching...');

// ########################### BASE ###########################
  // app config
  const CLIENT_BASE       = config.base.clientBase;
  const SESSION_SECRET    = config.base.sessionSecret;
  const MONGO_URL         = config.mongo.url;

  // express app
  const app = express();

  // cors
  const whitelist = [CLIENT_BASE, 'https://studio.apollographql.com'];
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


// ######################## AUTH SESSION ########################
  // session
  //mongoose.connect(MONGO_SESSION_URL);
  app.use(session({
    secret: SESSION_SECRET,
    rolling: true,
    resave: true, 
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000, sameSite: true },
    store: new MongoDBStore({ 
      uri: MONGO_URL,
    }),
  }));


// ########################## PASSPORT ##########################
  // passport init
  app.use(passport.initialize());
  app.use(passport.session());
  require('./middleware/passport')(passport);

  // auth routes
  app.use(require('./routers/auth.router'));


// ############################ CRON ############################
  // cron jobs
  require('./utils/cron/cron').initDefaultCronTasks();

  
// ######################## AUDIO_STREAM ########################
  // audio streamer
  app.use(require('./routers/audio-stream.router'));


// #################### MULTER - FILE_UPLOAD ####################
  // file upload
  app.use(require('./routers/file-upload.router'));


// ########################### FILES ############################
// files
  app.use('/uploads/images', express.static(path.join(__dirname, '..', 'uploads', 'images')));
  app.use('/uploads/audios', express.static(path.join(__dirname, '..', 'uploads', 'audios')));
  app.use('/uploads/others', express.static(path.join(__dirname, '..', 'uploads', 'others')));



// error handler
  //app.use(errorHandler);


export default app;
