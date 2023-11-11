const express = require('express');
const passport = require('passport');
const reportsController = require('../controllers/reports.controller');


// router
const reportsRouter = express.Router();


// endpoints
reportsRouter.post('/create', reportsController.createReport);
reportsRouter.post('/close',  passport.authenticate('jwt', { session: false }), reportsController.closeReport);
reportsRouter.get('/all',     passport.authenticate('jwt', { session: false }), reportsController.getAllReports);


// export
module.exports = reportsRouter;
