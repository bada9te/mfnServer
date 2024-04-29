const mongoose = require("mongoose");
const User = require("../src/models/users/users.mongo");

const mt = mongoose.Types.ObjectId;


module.exports = {
    user: {
        _id:      new mt(),
        email:    "test@gmail.com",
        nick:     "test",
        password: new User().generateHash("testpassword"),
    },
    secondUser: {
        _id:      new mt(),
        email:    "test@gmail.com",
        nick:     "test",
        password: new User().generateHash("testpassword"),
    },
    supportRequest: {
        _id: new mt(),
    },
    report: {
        _id: new mt(),
    },
    post1: {
        _id: new mt(),
    },
    post2: {
        _id: new mt(),
    },
    playlist: {
        _id: new mt(),
        title: "test"
    },
    notification: {
        _id: new mt(),
    },
    moderationAction: {
        _id:         new mt(),
        type:        "",
        verifyToken: "",
        user:        "",
    },
    comment: {
        _id: new mt(),
    },
    battle: {
        _id: new mt(),
    }
}