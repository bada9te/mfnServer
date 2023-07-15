const express = require('express');
const passport = require('passport');
const notificationsController = require('../../controllers/notifications/notifications.controller');

// router
const notificationsRouter = express.Router();

// endpoints
notificationsRouter.post('/create',                passport.authenticate('jwt', { session: false }), notificationsController.createNotification);
notificationsRouter.post('/delete',                passport.authenticate('jwt', { session: false }), notificationsController.deleteNotificationById);
notificationsRouter.post('/mark-as-read',          passport.authenticate('jwt', { session: false }), notificationsController.markNotificationAsRead);
notificationsRouter.get ('/get-all-with-receiver', passport.authenticate('jwt', { session: false }), notificationsController.getAllNotificationsWithReceiverId);
notificationsRouter.get ('/ids',                   passport.authenticate('jwt', { session: false }), notificationsController.getAllNotificationsByIds);

// export
module.exports = notificationsRouter;