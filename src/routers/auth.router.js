// https://www.digitalocean.com/community/tutorials/easy-node-authentication-linking-all-accounts-together


const express = require('express');
const passport = require('passport');


const authRouter = express.Router();

// logout
authRouter.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================


// local --------------------------------
    // login
    authRouter.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', 
        failureRedirect : '/login',
        failureFlash : true // allow flash messages
    }));
    // register
    authRouter.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/', 
        failureRedirect : '/register',
        failureFlash : true // allow flash messages
    }));
    

// facebook -------------------------------
	authRouter.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
	authRouter.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect : '/',
        failureRedirect : '/login'
    }));


// twitter --------------------------------
    authRouter.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));
    authRouter.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect : '/',
        failureRedirect : '/login'
    }));


// google ---------------------------------
    authRouter.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    authRouter.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect : '/',
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




