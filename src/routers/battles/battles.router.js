const express = require('express');
const passport = require('passport');
const battlesController = require('../../controllers/battles/battles.controller');


// router 
const battlesRouter = express.Router();

// endpoints
battlesRouter.post('/add',    passport.authenticate('jwt', { session: false }), battlesController.addNewBattleByIds);
battlesRouter.post('/delete', passport.authenticate('jwt', { session: false }), battlesController.deleteBattleById);
battlesRouter.post('/vote',   passport.authenticate('jwt', { session: false }), battlesController.makeVote);
battlesRouter.get ('/all-with-status', battlesController.getAllBattlesByStatus);

// export
module.exports = battlesRouter;
