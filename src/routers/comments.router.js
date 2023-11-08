const express = require('express');
const passport = require('passport');
const commentsController = require('../controllers/comments.controller');


// router
const commentsRouter = express.Router();

// endpoints
commentsRouter.post('/add',       passport.authenticate('jwt', { session: false }), commentsController.addComment);
commentsRouter.post('/remove',    passport.authenticate('jwt', { session: false }), commentsController.removeById);
commentsRouter.post('/ids-array', passport.authenticate('jwt', { session: false }), commentsController.getManyByIds);
commentsRouter.get ('/id',        passport.authenticate('jwt', { session: false }), commentsController.getOneById);


module.exports = commentsRouter;