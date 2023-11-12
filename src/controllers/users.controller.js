const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersModel = require("../models/users/users.model");
const { addUserDB, deleteUserByIdDB, updateUserDB, getUserByEmailDB, getUserByIdDB, getUsersByIdsDB, validateUserDB, getAllUsersDB, getUsersByNicknameDB, switchSubscriptionOnUserDB, confirmAccountDB, restoreAccountDB, prepareAccountToRestoreDB } = require('../db-reslovers/users-db-resolver');
//const mongooseObjectId = require('mongoose').Types.ObjectId;
require('dotenv').config();


// rsa private key
const keysPath = path.join(__dirname, '..', 'utils', 'rsa');
const PRIVATE_KEY_REFRESH = fs.readFileSync(path.join(keysPath, 'id_rsa_pri.pem'), 'utf-8');
const PRIVATE_KEY_ACCESS  = fs.readFileSync(path.join(keysPath, 'id_rsa_pri.pem'), 'utf-8');


// register / add user
const addUser = async(req, res, next) => {
    const user = req.body;

    try {
        const createdUser = await addUserDB(user);
        return res.status(200).json({
            done: true,
            user: createdUser,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


// login 
const loginUser = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await usersModel.getUserByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        if (!await bcrypt.compare(password, user.password)) {
            throw new Error("Password is not valid");
        }

        const payload = {
            username: user.email,
            id: user._id,
        }

        const accessToken = jwt.sign(payload, PRIVATE_KEY_ACCESS, { 
            expiresIn: "10m",
            algorithm: "RS256",
        });

        const refreshToken = jwt.sign(payload, PRIVATE_KEY_REFRESH, { 
            expiresIn: "14d",
            algorithm: "RS256",
        });

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',  // or 'Lax', it depends
            maxAge: 604800000 * 2,  // 14 days
            path: '/',
        });

        let expiresAtDate = new Date();
        expiresAtDate.setMinutes(expiresAtDate.getMinutes() + 10);

        return res.status(200).json({
            done: true,
            user: user,
            token: {
                expiresAt: expiresAtDate.toISOString(),
                accessToken: `Bearer ${accessToken}`,
            },
        });
        
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// refresh access  token
const refreshAccessToken = (req, res, next) => {
    if (req.cookies?.jwt) {
        const refreshToken = req.cookies.jwt;

        jwt.verify(refreshToken, PRIVATE_KEY_REFRESH, (err, decoded) => {
            if (err) {
                err.message = 'Wrong refresh token';
                err.status = 401;
                return next(err);
            } else {
                const userId = req.body.id;
                const userEmail = req.body.email;

                const accessToken = jwt.sign({
                    username: userEmail,
                    id: userId,
                }, PRIVATE_KEY_ACCESS, {
                    expiresIn: "10m",
                    algorithm: "RS256",
                });

                let expiresAtDate = new Date();
                expiresAtDate.setMinutes(expiresAtDate.getMinutes() + 10);

                //console.log('New token will expire at:', expiresAtDate.toISOString());

                return res.status(200).json({
                    done: true,
                    token: {
                        expiresAt: expiresAtDate.toISOString(),
                        accessToken: `Bearer ${accessToken}`,
                    },
                });
            }
        });
    } else {
        let err = new Error();
        err.message = 'No resfresh token provided';
        err.status = 401;
        return next(err);
    }
}

// logout
const logoutUser = async(req, res) => {
    try {
        res.clearCookie('jwt');
        req.logout((err) => {
            if (err) throw new Error(err);
            return res.status(200).json({
                done: true,
            });
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            done: true,
        });
    }
}

// remove by email
const deleteUserById = async(req, res, next) => {
    const id = req.body.id;
    try {
        const user = await deleteUserByIdDB(id);
        return res.status(200).json({
            done: true,
            user,
        })
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


// update user
const updateUser = async(req, res, next) => {
    const id = req.body.id;
    const value = req.body.value;
    const what  = req.body.what;

    try {
        const user = await updateUserDB(id, value, what);
        return res.status(200).json({
            done: true,
            user,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


// get by email
const getUserByEmail = async(req, res, next) => {
    const email = req.query.email;
    try {
        const user = await getUserByEmailDB();
        return res.status(200).json({
            done: true,
            user: user,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// get by id
const getUserById = async(req, res, next) => {
    const id = req.query.id;
    console.log(id)
    try {
        const user = await getUserByIdDB(id);
        return res.status(200).json({
            done: true,
            user: user,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// get by ids array
const getUsersByIds = async(req, res, next) => {
    const ids = req.query.ids;
    try {
        const users = await getUsersByIdsDB(ids);
        return res.status(200).json({
            done: true,
            users,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
 }


// validate
const validateUser = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await validateUserDB(email, password);

        return res.status(200).json({
            done: true,
            user,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// get all
const getAllUsers = async(req, res, next) => {
    try {
        const users = await getAllUsersDB();
        
        return res.status(200).json({
            done: true,
            users: users,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


// get by nick //////////////////
const getByNickname = async(req, res, next) => {
    const nickname = req.query.nickname;

    try {
        const users = await getUsersByNicknameDB(nickname);
        return res.status(200).json({
            done: true,
            users,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// subscribe on or unsubscribe from user
const switchSubscriptionOnUser = async(req, res, next) => {
    const userId = req.body.userId;
    const subscriberId = req.body.subscriberId

    try {
        const { user1, user2 } = await switchSubscriptionOnUserDB(userId, subscriberId);

        return res.status(200).json({
            done: true,
            user1,
            user2,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// confirm account creation
const confirmAccount = async(req, res, next) => {
    const userId = req.body.userId;
    const actionId = req.body.actionId;
    const verifyToken = req.body.verifyToken;

    try {
        const { action, user } = await confirmAccountDB(userId, actionId, verifyToken);

        if (action && user) {
            return res.status(200).json({
                done: true,
                action,
                user,
            });
        } else {
            return res.status(400).json({
                done: false,
            });
        }
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// restore account
const restoreAccount = async(req, res, next) => {
    const userId = req.body.userId;
    const actionId = req.body.actionId;
    const verifyToken = req.body.verifyToken;
    const type = req.body.type;
    
    try {
        const { action, user } = await restoreAccountDB(
            userId,
            actionId,
            verifyToken,
            type
        );
        if (action && user) {
            return res.status(200).json({
                done: true,
                user,
            });
        } else {
            error.status = 400;
            return next(error);
        }
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

//prepare account to restore
const prepareAccountToRestore = async(req, res, next) => {
    const email = req.body.email;
    const type = req.body.type;
    
    try {
        const { user, action } = prepareAccountToRestoreDB(email, type);
        if (action && user) {
            return res.status(200).json({
                done: true,
                user,
            });
        } else {
            error.status = 400;
            return next(error);
        }
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}



module.exports = {
    addUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    deleteUserById,
    updateUser,
    getUserByEmail,
    getUserById,
    getUsersByIds,
    validateUser,
    getAllUsers,
    getByNickname,
    switchSubscriptionOnUser,
    confirmAccount,
    restoreAccount,
    prepareAccountToRestore,
}
