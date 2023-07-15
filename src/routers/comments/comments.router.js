const express = require('express');
const passport = require('passport');
const commentsController = require('../../controllers/comments/comments.controller');


// router
const commentsRouter = express.Router();

// endpoints
commentsRouter.post('/add',       passport.authenticate('jwt', { session: false }), commentsController.addComment);
commentsRouter.post('/rm-id',     passport.authenticate('jwt', { session: false }), commentsController.removeById);
commentsRouter.post('/ids-array', passport.authenticate('jwt', { session: false }), commentsController.getManyByIds);


module.exports = commentsRouter;