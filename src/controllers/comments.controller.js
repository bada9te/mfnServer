const { addCommentResolver, getManyCommentsByIdsResolver, getOneCommentByIdResolver, removeCommentByIdResolver } = require('../db-reslovers/comments-db-resolver');
const commentsModel = require('../models/comments/comments.model');
const postsModel = require('../models/posts/posts.model');


// add / create comment
const addComment = async(req, res, next) => {
    const comment = req.body.comment;

    try {
        const createdComment = await addCommentResolver(comment);
        return res.status(201).json({
            done: true,
            comment: createdComment,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

const getManyByIds = async(req, res, next) => {
    const ids = req.body.ids;

    try {
        const comments = await getManyCommentsByIdsResolver(ids);
        return res.status(200).json({
            done: true,
            comments: comments,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

const getOneById = async(req, res, next) => {
    const id = req.query.id;

    try {
        const comment = await getOneCommentByIdResolver(id);
        return res.status(200).json({
            done: true,
            comment,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


const removeById = async(req, res, next) => {
    const id = req.body.id;

    try {
        const comment = await removeCommentByIdResolver(id);
        return res.status(200).json({
            comment,
            done: true,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


module.exports = {
    addComment,
    getManyByIds,
    getOneById,
    removeById,
}
