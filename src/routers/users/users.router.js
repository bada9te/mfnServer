const express = require('express');
const passport = require('passport');
const usersController = require('../../controllers/users/users.controller');


// router
const usersRouter = express.Router();


// endpoints
usersRouter.post('/delete',             passport.authenticate('jwt', { session: false }), usersController.deleteUserById);
usersRouter.post('/update',             passport.authenticate('jwt', { session: false }), usersController.updateUser);
usersRouter.post('/swicth-sub-on-user', passport.authenticate('jwt', { session: false }), usersController.switchSubscriptionOnUser);

usersRouter.post('/refresh-access-token', usersController.refreshAccessToken);
usersRouter.post('/logout',          usersController.logoutUser);
usersRouter.post('/register',        usersController.addUser);
usersRouter.post('/login',           usersController.loginUser);
usersRouter.post('/validate',        usersController.validateUser);
usersRouter.post('/verify',          usersController.confirmAccount);
usersRouter.post('/restore',         usersController.restoreAccount);
usersRouter.post('/restore-prepare', usersController.prepareAccountToRestore);

usersRouter.get ('/email',           usersController.getUserByEmail);
usersRouter.get ('/all',             usersController.getAllUsers);
usersRouter.get ('/id',              usersController.getUserById);
usersRouter.get ('/ids',             usersController.getUsersByIds);
usersRouter.get ('/by-nickname',     usersController.getByNickname);




// export
module.exports = usersRouter;
