const express = require('express');
const passport = require('passport');
const notificationsController = require('../../controllers/notifications/notifications.controller');

// router
const notificationsRouter = express.Router();

// endpoints
notificationsRouter.post('/create',                passport.authenticate('jwt', { session: false }), notificationsController.createNotification);
notificationsRouter.post('/delete',                passport.authenticate('jwt', { session: false }), notificationsController.deleteNotificationById);
notificationsRouter.post('/mark-as-read',          passport.authenticate('jwt', { session: false }), notificationsController.markNotificationAsReadById);
notificationsRouter.get ('/get-all-unread',        passport.authenticate('jwt', { session: false }), notificationsController.getAllUnreadNotifications);
notificationsRouter.get ('/get-all-read',          passport.authenticate('jwt', { session: false }), notificationsController.getAllReadNotifications);
notificationsRouter.get ('/ids',                   passport.authenticate('jwt', { session: false }), notificationsController.getAllNotificationsByIds);

// export
module.exports = notificationsRouter;