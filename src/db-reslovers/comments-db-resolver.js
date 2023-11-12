const commentsModel = require("../models/comments/comments.model");
const postsModel = require("../models/posts/posts.model");


const addCommentDB = async(comment) => {
    let createdComment;
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
        createdComment = comment;
    });
    return createdComment;
}

const getManyCommentsByIdsDB = async(ids) => {
    return await commentsModel.getAllWithIds(ids);
}

const getOneCommentByIdDB = async(id) => {
    return await commentsModel.getById(id);
}

const removeCommentByIdDB = async(id) => {
    let removedComment = null;
    await commentsModel.removeById(id).then(async(comment) => {
        removedComment = comment;
        await postsModel.addOrRemoveComment(comment.post, comment._id);
    });
    return removedComment;
}


module.exports = {
    addCommentDB,
    getManyCommentsByIdsDB,
    getOneCommentByIdDB,
    removeCommentByIdDB,
}
