const express = require('express');
const passport = require('passport');
const reportsController = require('../controllers/reports.controller');


// router
const reportsRouter = express.Router();


// endpoints
reportsRouter.post('/create', reportsController.createReport);
reportsRouter.post('/close',  passport.authenticate('jwt', { session: false }), reportsController.closeReport);


// export
module.exports = reportsRouter;
