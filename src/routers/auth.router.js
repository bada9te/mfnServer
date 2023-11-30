// https://www.digitalocean.com/community/tutorials/easy-node-authentication-linking-all-accounts-together


const express = require('express');
const passport = require('passport');
const config = require('../config');


const authRouter = express.Router();

// logout
authRouter.get('/logout', function(req, res) {
    req.logout((err) => {
        err && console.log('Logout error:', err);
    });
    //res.redirect(config.base.clientBase)
    res.end();
});

authRouter.get("/current-user", (req, res) => {
    return res.status(200).json({
        done: req.user ? true : false,
        user: req.user,
    });
});

authRouter.post("/update-session-user", (req, res) => {
    req.logIn(req.body.user, function(err) {
        if (err) { return next(err); }
        return res.status(200).json(user);
    });
});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================


// local --------------------------------
    // login
    authRouter.post('/login', (req, res, next) => {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { 
                res.status(401);
                res.end(info.message);
                return;
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.status(200).json(user);
            });
        })(req, res, next);
    });
    // register
    authRouter.post('/register', (req, res, next) => {
        passport.authenticate('local-signup', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { 
                res.status(401);
                res.end(info.message);
                return;
            }
            
            return res.status(201).json(user);
        })(req, res, next);
    });
    

// facebook -------------------------------
	authRouter.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
	authRouter.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect : '/',
        failureRedirect : '/login'
    }));


// twitter --------------------------------
    authRouter.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));
    authRouter.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect : config.base.clientBase,
        failureRedirect : '/login'
    }));


    authRouter.get('/auth/google', passport.authenticate('google', { scope: [ 'email', 'profile' ] }));
    authRouter.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect : config.base.clientBase,
        failureRedirect : '/login'
    }));


// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================


// locally --------------------------------
    authRouter.post('/connect/local', passport.authenticate('local-signup', {
        failureFlash : true // allow flash messages
    }));

// facebook -------------------------------
    authRouter.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));
    authRouter.get('/connect/facebook/callback', passport.authorize('facebook'));

// twitter --------------------------------
    authRouter.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));
    authRouter.get('/connect/twitter/callback', passport.authorize('twitter'));


// google ---------------------------------
    authRouter.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));
    authRouter.get('/connect/google/callback', passport.authorize('google'));


// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================


// local -----------------------------------
    authRouter.get('/unlink/local', function(req, res) {
        let user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });

// facebook -------------------------------
    authRouter.get('/unlink/facebook', function(req, res) {
        let user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });

// twitter --------------------------------
    authRouter.get('/unlink/twitter', function(req, res) {
        let user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

// google ---------------------------------
    authRouter.get('/unlink/google', function(req, res) {
        let user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });


module.exports = authRouter;

