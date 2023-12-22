const mongoose = require("mongoose");
const User = require("../src/models/users/users.mongo");

const mt = mongoose.Types.ObjectId;

const userId = 

module.exports = {
    user: {
        _id:      new mt(),
        email:    "test@gmail.com",
        nick:     "test",
        password: new User().generateHash("testpassword"),
    },
    supportRequestId:   new mt(),
    reportId:           new mt(),
    postId1:            new mt(),
    postId2:            new mt(),
    playlistId:         new mt(),
    notificationId:     new mt(),
    moderationAction: {
        _id:         new mt(),
        type:        "",
        verifyToken: "",
        user:        "",
    },
    commentId:          new mt(),
    battleId:           new mt(),
}