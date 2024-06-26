require('dotenv-expand').expand(require('dotenv').config())

const MONGO_URL = process.env.ENV_TYPE !== "test" ? process.env.MONGO_URL : process.env.MONGO_URL_TEST;
const mongoPrefix = MONGO_URL.slice(MONGO_URL.lastIndexOf('/'), MONGO_URL.length);

export default {
    base: {
        port:          process.env.PORT,
        clientBase:    process.env.CLIENT_BASE,
        cookieAccess1: process.env.COOKIE_ACCESS_1,
        cookieAccess2: process.env.COOKIE_ACCESS_2,
        sessionSecret: process.env.SESSION_SECRET,
        envType:       process.env.ENV_TYPE,
    },
    mongo: {
        url: process.env.MONGO_URL,
        url_test: process.env.MONGO_URL_TEST,
        prefix: mongoPrefix,
    },
    passport: {
        facebookAuth: {
            clientID:     process.env.AUTH_FACEBOOK_CLIENT_ID,
            clientSecret: process.env.AUTH_FACEBOOK_CLIENT_SECRET,
            callbackURL:  process.env.AUTH_FACEBOOK_CALLBACK_URL,
        },
        twitterAuth: {
            consumerKey:    process.env.AUTH_TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.AUTH_TWITTER_CONSUMER_SECRET,
            callbackURL:    process.env.AUTH_TWITTER_CALLBACK_URL,
        },
        googleAuth: {
            clientID:     process.env.AUTH_GOOGLE_CLIENT_ID,
            clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
            callbackURL:  process.env.AUTH_GOOGLE_CALLBACK_URL,
        }
    },
};