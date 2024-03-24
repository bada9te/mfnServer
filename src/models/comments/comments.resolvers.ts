import * as commentsModel from "../../models/comments/comments.model";
import * as postsModel from "../../models/posts/posts.model";


export default {
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
                    const replyingComment = await commentsModel.getById(comment.isReplyTo) as unknown as any;
                    let replies = replyingComment?.replies || [];
                    replies.push(data[0]._id);
                    await commentsModel.updateById(replyingComment._id, replies, "replies");
                } else {
                    // assign comment to post
                    await postsModel.addOrRemoveComment(comment.post, data[0]._id as string);
                }
                comment = {...comment, ...data[0]._doc}
                createdComment = comment;
            });
            return createdComment;
        },
        commentDeleteById: async(_, { _id }) => {
            let removedComment = null;
            await commentsModel.removeById(_id).then(async(comment) => {
                removedComment = comment as any;
                await postsModel.addOrRemoveComment(removedComment.post, removedComment._id);
            });
            return removedComment;
        }
    }
}