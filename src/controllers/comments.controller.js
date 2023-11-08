const commentsModel = require('../models/comments/comments.model');
const postsModel = require('../models/posts/posts.model');


// add / create comment
const addComment = async(req, res, next) => {
    const comment = req.body.comment;

    try {
        // add comment
        await commentsModel.addComment(comment).then(async(data) => {
            // if it is a reply to sb's comment
            if (comment.isReply) {
                const replyingComment = await commentsModel.getById(comment.isReplyTo);
                let replies = replyingComment?.replies || [];
                replies.push(data[0]._id);
                await commentsModel.updateById(replyingComment._id, replies, "replies");
            } else {
                // assign comment to post
                await postsModel.addOrRemoveComment(comment.post, data[0]._id);
            }
            comment._id = data[0]._id;
        });
        return res.status(201).json({
            done: true,
            comment: comment,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

const getManyByIds = async(req, res, next) => {
    const ids = req.body.ids;

    try {
        const comments = await commentsModel.getAllWithIds(ids);
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
        const comment = await commentsModel.getById(id);
        return res.status(200).json({
            done: true,
            comment: comment,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


const removeById = async(req, res, next) => {
    const id = req.body.id;

    try {
        let removedComment = null;
        await commentsModel.removeById(id).then(async(comment) => {
            removedComment = comment;
            await postsModel.addOrRemoveComment(comment.post, comment._id);
        });
        return res.status(200).json({
            comment: removedComment,
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
