const express = require('express');
const passport = require('passport');
const postsController = require('../controllers/posts.controller');


// router
const postsRouter = express.Router();


// endpoints
postsRouter.post('/add',         passport.authenticate('jwt', { session: false }), postsController.addPost);
postsRouter.post('/delete',      passport.authenticate('jwt', { session: false }), postsController.deletePostById);
postsRouter.post('/update',      passport.authenticate('jwt', { session: false }), postsController.updatePost);
postsRouter.post('/switch-like', passport.authenticate('jwt', { session: false }), postsController.switchLike);
postsRouter.post('/switch-save', passport.authenticate('jwt', { session: false }), postsController.swicthPostInSaved);
postsRouter.get ('/saved',       passport.authenticate('jwt', { session: false }), postsController.getSavedPostsByUserId);

postsRouter.get('/id',       postsController.getPostById);
postsRouter.get('/all',      postsController.getAllPosts);
postsRouter.get('/owner',    postsController.getAllWithOwnerId);
postsRouter.get('/by-title', postsController.getByTitle);
postsRouter.get('/ids',      postsController.getManyByIds);


// export
module.exports = postsRouter;