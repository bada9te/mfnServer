const express = require('express');
const passport = require('passport');
const moderationController = require('../../controllers/moderation/moderation.controller');


// router
const moderationRouter = express.Router();

moderationRouter.post('/create', moderationController.createAction);
moderationRouter.post('/delete', moderationController.deleteAction);
moderationRouter.post('/validate', moderationController.validateAction);

module.exports = moderationRouter;