const express = require('express');
const passport = require('passport');
const supportRequestsController = require('../controllers/support-requests.controller');


// router
const supportRequestsRouter = express.Router();


// endpoints
supportRequestsRouter.post('/create', supportRequestsController.createSupportRequest);
supportRequestsRouter.post('/close', supportRequestsController.closeSupportRequest);
supportRequestsRouter.get('/all',    passport.authenticate('jwt', { session: false }), supportRequestsController.getAllSupportRequests);


// export
module.exports = supportRequestsRouter;
