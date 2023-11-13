const { getPostByIdDB, getAllPostsDB, getAllPostsWithOwnerIdDB, getSavedPostsByUserIdDB, getPostByTitleDB, getManyPostsByIdsDB, addPostDB, updatePostDB, deletePostByIdDB, switchPostLikeDB, swicthPostInSavedDB } = require("../../db-reslovers/posts-db-resolver");
const exec = require("../../db-reslovers/execGQL");


module.exports = {
    Query: {
        post: async(_, { _id }) => {
            return await exec(() => getPostByIdDB(_id)); 
        },
        posts: async(_, { range }) => {
            return await exec(() => getAllPostsDB(range));
        },
        postsByOwner: async(_, { owner, range }) => {
            return await exec(() => getAllPostsWithOwnerIdDB(owner, range));
        },
        postsSavedByUser: async(_, { user, range }) => {
            return await exec(() => getSavedPostsByUserIdDB(user, range));
        },
        postsByTitle: async(_, { input }) => {
            const { userId, title, userIsOwner } = input;
            return await exec(() => getPostByTitleDB(title, userId, userIsOwner));
        },
        postsByIds: async(_, { ids }) => {
            return await exec(() => getManyPostsByIdsDB(ids));
        },
    },
    Mutation: {
        postCreate: async(_, { input }) => {
            return await exec(() => addPostDB(input));
        },
        postUpdate: async(_, { input }) => {
            const { post, value, what } = input;
            return await exec(() => updatePostDB(post, value, what));
        },
        postDeleteById: async(_, { _id }) => {
            return await exec(() => deletePostByIdDB(_id));
        },
        postSwitchLike: async(_, { input }) => {
            const { userId, postId } = input;
            return await exec(() => switchPostLikeDB(userId, postId));
        },
        postSwicthInSaved: async(_, { input }) => {
            const { userId, postId } = input;
            return await exec(() => swicthPostInSavedDB(userId, postId));
        }
    }
}