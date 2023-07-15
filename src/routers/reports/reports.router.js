const express = require('express');
const passport = require('passport');
const reportsController = require('../../controllers/reports/reports.controller');


// router
const reportsRouter = express.Router();


// endpoints
reportsRouter.post('/create', passport.authenticate('jwt', { session: false }), reportsController.createReport);
reportsRouter.post('/close',  passport.authenticate('jwt', { session: false }), reportsController.closeReport);


// export
module.exports = reportsRouter;
