const fs = require('fs');
const path = require('path');
const usersModel = require('../models/users/users.mongo');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();


// extract token from cookies
const cookieExtractor = function(req) {
    /*
    console.log(req.headers)
    let pairs = req.headers.cookie.split(";");
    let splittedPairs = pairs.map(cookie => cookie.split("="));

    const cookieObj = splittedPairs.reduce(function (obj, cookie) {
        obj[decodeURIComponent(cookie[0].trim())] = decodeURIComponent(cookie[1].trim());
        return obj;
    }, {})
    //console.log(cookieObj['jwt'])
    return cookieObj['jwt'];*/

    return req.headers.accessToken;
};


const initPassportStarategies = (passport, app) => {
    const keyPath = path.join(__dirname, '..', 'utils', 'rsa', 'id_rsa_pub.pem');
    const PUBLIC_KEY = fs.readFileSync(keyPath, 'utf-8');


    const options = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: PUBLIC_KEY,
        algorithms: ['RS256'],
    };

    const jwtStrategy = new JwtStrategy(options, async(payload, done) => {
        await usersModel.findById(payload.id)
        .then((user) => {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {
            return done(err, null);
        }); 
    });

    passport.use(jwtStrategy);
    
    

    console.log("[PASSPORT] Startegies initialized.");
}


module.exports = initPassportStarategies;