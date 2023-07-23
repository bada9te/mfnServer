const commentsModel = require('../../models/comments/comments.model');
const postsModel = require('../../models/posts/posts.model');


// add / create comment
const addComment = async(req, res) => {
    const comment = req.body.comment;
    comment.createdAt = new Date(Date.now()).toISOString();

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
                /*
                const post = await postsModel.getPostById(comment.post);
                let postComments = post.comments;
                postComments.push(data[0]._id);
                await postsModel.updatePost(comment.post, postComments, "comments");
                */
            }
            comment._id = data[0]._id;
        });
        return res.status(201).json({
            done: true,
            comment: comment,
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            done: false,
            error: 'Sth went wrong!',
        });
    }
}

const getManyByIds = async(req, res) => {
    const ids = req.body.ids;

    try {
        const comments = await commentsModel.getAllWithIds(ids);
        return res.status(200).json({
            done: true,
            comments: comments,
        });
    } catch (error) {
        return res.status(400).json({
            done: false,
            error: 'Sth went wrong!',
        });
    }
}

const getOneById = async(req, res) => {
    const id = req.query.id;

    try {
        const comment = await commentsModel.getById(id);
        return res.status(200).json({
            done: true,
            comment: comment,
        });
    } catch (error) {
        return res.status(400).json({
            done: false,
            error: 'Sth went wrong!',
        });
    }
}


const removeById = async(req, res) => {
    const id = req.body.id;

    try {
        let removedComment = null;
        await commentsModel.removeById(id).then(async(comment) => {
            removedComment = comment;
            if (comment?.replies?.length > 0) {
                await commentsModel.removeManyByIds(comment.replies);
            }
            await postsModel.addOrRemoveComment(comment.post, comment._id);
            /*
            const post = await postsModel.getPostById(comment.post);
            let postComments = post.comments;
            postComments.splice(postComments.indexOf(comment._id), 1);
            await postsModel.updatePost(comment.post, postComments, "comments");
            */
            //console.log(comment)
        });
        return res.status(200).json({
            comment: removedComment,
            done: true,
        });
    } catch (error) {
        return res.status(400).json({
            done: false,
            error: 'Sth went wrong!',
        });
    }
}


module.exports = {
    addComment,
    getManyByIds,
    getOneById,
    removeById,
}
