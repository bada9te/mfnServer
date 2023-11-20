const fs = require('fs');
const path = require('path');
const usersModel = require('../../models/users/users.model');
const User = require('../../models/users/users.mongo');

const LocalStrategy    = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy  = require('passport-twitter').Strategy;
const GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
const GraphQLLocalStrategy = require('graphql-passport').GraphQLLocalStrategy;
require('dotenv').config();



const initPassportStarategies = (passport) => {
    const keyPath = path.join(__dirname, '..', '..', 'utils', 'rsa', 'id_rsa_pub.pem');
    const PUBLIC_KEY = fs.readFileSync(keyPath, 'utf-8');

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, async(req, email, password, done) => {
        try {
            const user = await User.findOne({ 'local.email' :  email })
            
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }

            if (!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Wrong password.'));
            }
            
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
    
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    }, async(req, email, password, done) => {
        try {
            const existingUser = await User.findOne({ 'local.email': email });

            if (existingUser) {
                return done(null, false, req.flash('signupMessage', 'User with this email already exists.'));
            }
            
            if (req.user) {
                let user = req.user;
                user.local.email = email;
                user.local.password = password;

                user.save()
                    .then(updatedUser => {
                        return done(null, updatedUser);
                    }).catch(err => {
                        throw err;
                    });
            } else {
                let newUser = new User();
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.nick = req.body.nick;

                newUser.save()
                    .then(createdUser => {
                        return done(null, createdUser);
                    }).catch(err => {
                        throw err;
                    });
            }
        } catch (error) {
            return done(error);
        }
    }));


    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    }, async(req, token, refreshToken, profile, done) => {
        try {
            if (!req.user) {
                const user = User.findOne({ 'facebook.id' : profile.id });

                if (user) {
                    // if there is a user id already but no token (user was linked at one point and then removed)
                    if (!user.facebook.token) {
                        user.facebook.token = token;
                        user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                        user.facebook.email = profile.emails[0].value;

                        user.save()
                            .then(updatedUser => {
                                return done(null, updatedUser);
                            }).catch(err => {
                                throw err;
                            });
                    }

                    return done(null, user); 
                } else {
                    // if there is no user, create 
                    let newUser = new User();

                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value;

                    newUser.save()
                        .then(createdUser => {
                            return done(null, createdUser);
                        }).catch(err => {
                            throw err;
                        });
                }
            } else {
                // user already exists and is logged in, we have to link accounts
                let user = req.user; // pull the user out of the session

                user.facebook.id = profile.id;
                user.facebook.token = token;
                user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = profile.emails[0].value;

                user.save()
                    .then(updatedUser => {
                        return done(null, updatedUser);
                    }).catch(err => {
                        throw err;
                    });
            }
        } catch (error) {
            return done(error);
        }
    }));


    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================

    passport.use(new TwitterStrategy({
        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL,
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    }, async(req, token, tokenSecret, profile, done) => {
        try {
            if (!req.user) {
                const user = User.findOne({ 'twitter.id' : profile.id });

                if (user) {
                    // if there is a user id already but no token (user was linked at one point and then removed)
                    if (!user.twitter.token) {
                        user.twitter.token = token;
                        user.twitter.username = profile.username;
                        user.twitter.displayName = profile.displayName;

                        user.save
                            .then(updatedUser => {
                                return done(null, updatedUser);
                            }).catch(err => {
                                throw err;
                            });
                    }

                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user, create 
                    let newUser = new User();

                    newUser.twitter.id = profile.id;
                    newUser.twitter.token = token;
                    newUser.twitter.username = profile.username;
                    newUser.twitter.displayName = profile.displayName;

                    newUser.save()
                        .then(createdUser => {
                            return done(null, createdUser);
                        }).catch(err => {
                            throw err;
                        });
                }
            } else {
                // user already exists and is logged in, we have to link accounts
                let user = req.user; // pull the user out of the session

                user.twitter.id = profile.id;
                user.twitter.token = token;
                user.twitter.username = profile.username;
                user.twitter.displayName = profile.displayName;

                user.save()
                    .then(updatedUser => {
                        return done(null, updatedUser);
                    }).catch(err => {
                        throw err;
                    });
            }
        } catch (error) {
            return done(error);
        }
    }));
    
    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    }, async(req, token, refreshToken, profile, done) => {
        try {
            if (!req.user) {
                const user = User.findOne({ 'google.id' : profile.id });

                if (user) {
                    // if there is a user id already but no token (user was linked at one point and then removed)
                    if (!user.google.token) {
                        user.google.token = token;
                        user.google.name  = profile.displayName;
                        user.google.email = profile.emails[0].value; // pull the first email

                        user.save()
                            .then(updatedUser => {
                                return done(null, updatedUser);
                            }).catch(err => {
                                throw err;
                            });
                    }

                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user, create 
                    let newUser = new User();

                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    newUser.save()
                        .then(createdUser => {
                            return done(null, createdUser);
                        }).catch(err => {
                            throw err;
                        });
                }
            } else {
                // user already exists and is logged in, we have to link accounts
                let user = req.user; // pull the user out of the session

                user.google.id  = profile.id;
                user.google.token = token;
                user.google.name = profile.displayName;
                user.google.email = profile.emails[0].value; // pull the first email

                user.save()
                    .then(updatedUser => {
                        return done(null, updatedUser);
                    }).catch(err => {
                        throw err;
                    });
            }
        } catch (error) {
            return done(error);
        }
    }));

    
    console.log("[PASSPORT] Startegies initialized.");
}


module.exports = initPassportStarategies;