const fs = require('fs');
const path = require('path');
const usersModel = require('../../models/users/users.model');
const moderationModel = require('../../models/moderation/moderation.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('../../utils/mailer/nodemailer');
//const mongooseObjectId = require('mongoose').Types.ObjectId;
require('dotenv').config();


// rsa private key
const keysPath = path.join(__dirname, '..', '..', 'utils', 'rsa');
const PRIVATE_KEY_REFRESH = fs.readFileSync(path.join(keysPath, 'id_rsa_pri.pem'), 'utf-8');
const PRIVATE_KEY_ACCESS  = fs.readFileSync(path.join(keysPath, 'id_rsa_pri.pem'), 'utf-8');
const generateRandomString = async() => Math.floor(Math.random() * Date.now()).toString(36);


// register / add user
const addUser = async(req, res) => {
    const user = req.body;
    user.password = await bcrypt.hash(user.password, 10);

    try {
        const checkUser = await usersModel.getUserByEmail(user.email);
        if (checkUser) {
            throw new Error("User with this email already exists");
        }

        user.createdAt = new Date().toISOString();
        await usersModel.addUser(user).then(async(data) => {
            const verifyToken = await generateRandomString();
            await moderationModel.createAction({
                user: data[0]._id,
                type: "verify",
                createdAt: new Date().toISOString(),
                verifyToken: verifyToken,
            }).then((action) => {
                sendMail.sendVerifyEmail(
                    data[0].email, 
                    data[0].nick, 
                    `${process.env.CLIENT_BASE.split(', ')[0]}/account-verify/${data[0]._id}/${action[0]._id}`,
                    verifyToken
                );
            });
        });

        return res.status(200).json({
            done: true,
            user: user,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            done: false,
            error: error.message,
        });
    }
}


// login 
const loginUser = async(req, res) => {
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
        return res.status(400).json({
            done: false,
            error: error.message,
        });
    }
}

// refresh access  token
const refreshAccessToken = (req, res) => {
    if (req.cookies?.jwt) {
        const refreshToken = req.cookies.jwt;

        jwt.verify(refreshToken, PRIVATE_KEY_REFRESH, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    done: false,
                    error: 'Wrong refresh token',
                });
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
        return res.status(401).json({
            done: false,
            error: 'No resfresh token provided',
        });
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
const deleteUserById = async(req, res) => {
    const id = req.body.id;
    try {
        await usersModel.deleteUserById(id);
        return res.status(200).json({
            done: true,
        })
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            done: false,
            error: 'Sth went wrong!',
        });
    }
}


// update user
const updateUser = async(req, res) => {
    const id = req.body.id;
    let   value = req.body.value;
    const what  = req.body.what;

    try {
        await usersModel.updateUser(id, value, what);
        return res.status(200).json({
            done: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            done: false,
            error: 'Sth went wrong',
        });
    }
}


// get by email
const getUserByEmail = async(req, res) => {
    const email = req.query.email;
    try {
        const user = await usersModel.getUserByEmail(email);
        return res.status(200).json({
            done: true,
            user: user,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            done: false,
            error: 'Sth went wrong',
        });
    }
}

// get by id
const getUserById = async(req, res) => {
    const id = req.query.id;
    try {
        const user = await usersModel.getUserById(id);
        return res.status(200).json({
            done: true,
            user: user,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: 'Sth went wrong',
        });
    }
}

// get by ids array
const getUsersByIds = async(req, res) => {
    const ids = req.query.ids;
    try {
        const users = await usersModel.getUsersByIds(ids);
        return res.status(200).json({
            done: true,
            users: users,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: 'Sth went wrong',
        });
    }
 }


// validate
const validateUser = async(req, res) => {
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

        return res.status(200).json({
            done: true,
            user: user,
        });
    } catch (error) {
        return res.status(400).json({
            done: false,
            error: error.message,
        });
    }
}

// get all
const getAllUsers = async(req, res) => {
    try {
        const users = await usersModel.getAllUsers();
        console.log(users)
        return res.status(200).json({
            done: true,
            users: users,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            done: false,
            error: error,
        });
    }
}


// get by nick
const getByNickname = async(req, res) => {
    const nickQuery = req.query.nickname;

    try {
        const users = await usersModel.getByNickname(nickQuery);
        return res.status(200).json({
            done: true,
            users: users,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            done: false,
            error: error,
        });
    }
}

// subscribe on or unsubscribe from user
const switchSubscriptionOnUser = async(req, res) => {
    const userId = req.body.userId;
    const subscriberId = req.body.subscriberId

    try {
        await usersModel.switchSubscriptionOnUser(subscriberId, userId);
        await usersModel.switchSubscribedOnUser(subscriberId, userId);

        return res.status(200).json({
            done: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            done: false,
            error: error,
        });
    }
}

// confirm account creation
const confirmAccount = async(req, res) => {
    const userId = req.body.userId;
    const actionId = req.body.actionId;
    const verifyToken = req.body.verifyToken;

    try {
        const action = await moderationModel.validateAction(userId, actionId, verifyToken, 'verify');
        if (action) {
            const user = await usersModel.confirmAccount(userId);
            await moderationModel.deleteAction(userId, actionId, verifyToken, 'verify');
            return res.status(200).json({
                done: true,
                user: user,
            });
        } else {
            return res.status(400).json({
                done: false,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            done: false,
            error: error,
        });
    }
}

// restore account
const restoreAccount = async(req, res) => {
    const userId = req.body.userId;
    const actionId = req.body.actionId;
    const verifyToken = req.body.verifyToken;
    const type = req.body.type;
    
    try {
        const action = await moderationModel.validateAction(userId, actionId, verifyToken, type);
        if (action) {
            let newValue = req.body.newValue;
            if (type === "password") {
                newValue = await bcrypt.hash(newValue, 10);
            }
            await usersModel.restoreAccount(userId, newValue, type).then(async(user) => {
                await moderationModel.deleteAction(userId, actionId, verifyToken, type);
                sendMail.sendInfoEmail(
                    user.email,
                    user.nick,
                    `Your account ${type} was successfully updated.`  
                );
            });
            return res.status(200).json({
                done: true,
            });
        } else {
            return res.status(400).json({
                done: false,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            done: false,
            error: error,
        });
    }
}

//prepare account to restore
const prepareAccountToRestore = async(req, res) => {
    const email = req.body.email;
    const type = req.body.type;
    
    try {
        const user = await usersModel.getUserByEmail(email);

        if (user) {
            const verifyToken = await generateRandomString();
            await moderationModel.createAction({
                user: user._id,
                type: type,
                createdAt: new Date().toISOString(),
                verifyToken: verifyToken,
            }).then((action) => {
                sendMail.sendRestoreEmail(
                    user.email,
                    user.nick,
                    `${process.env.CLIENT_BASE.split(', ')[0]}/account-restore/${user._id}/${action[0]._id}/${verifyToken}/${type}`,
                );
            })
        }
        
        return res.status(200).json({
            done: true,
            user: user,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            done: false,
            error: error,
        });
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
