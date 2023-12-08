const commentsModel = require("../../models/comments/comments.model");
const postsModel = require("../../models/posts/posts.model");


module.exports = {
    Query: {
        commentsByIds: async(_, { ids }) => {
            return await commentsModel.getAllWithIds(ids);
        },
        comment: async(_, { _id }) => {
            return await commentsModel.getById(_id);
        },
        commentReplies: async(_, { _id }) => {
            const data = await commentsModel.getCommentReplies(_id);
            return data.replies;
        },
        commentsByPostId: async(_, { _id }) => {
            return await commentsModel.getCommentsByPostId(_id);
        }
    },
    Mutation: {
        commentCreate: async(_, { input: comment }) => {
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
                comment = {...comment, ...data[0]._doc}
                createdComment = comment;
            });
            return createdComment;
        },
        commentDeleteById: async(_, { _id }) => {
            let removedComment = null;
            await commentsModel.removeById(_id).then(async(comment) => {
                removedComment = comment;
                await postsModel.addOrRemoveComment(comment.post, comment._id);
            });
            return removedComment;
        }
    }
}