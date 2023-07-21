const express = require('express');
const passport = require('passport');
const supportRequestsController = require('../../controllers/support-requests/support-requests.controller');


// router
const supportRequestsRouter = express.Router();


// endpoints
supportRequestsRouter.post('/create', supportRequestsController.createSupportRequest);
supportRequestsRouter.post('/close', supportRequestsController.closeSupportRequest);


// export
module.exports = supportRequestsRouter;
