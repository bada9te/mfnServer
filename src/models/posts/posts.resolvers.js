const { getPostByIdDB, getAllPostsDB, getAllPostsWithOwnerIdDB, getSavedPostsByUserIdDB, getPostByTitleDB, getManyPostsByIdsDB, addPostDB, updatePostDB, deletePostByIdDB, switchPostLikeDB, swicthPostInSavedDB } = require("../../db-reslovers/posts-db-resolver");
const exec = require("../../db-reslovers/execGQL");


module.exports = {
    Query: {
        getPostById: async(_, { _id }) => {
            return await exec(() => getPostByIdDB(_id)); 
        },
        getAllPosts: async(_, { skipCount }) => {
            return await exec(() => getAllPostsDB(skipCount));
        },
        getAllPostsWithOwnerId: async(_, { input }) => {
            const { ownerId, skipCount } = input;
            return await exec(() => getAllPostsWithOwnerIdDB(ownerId, skipCount));
        },
        getSavedPostsByUserId: async(_, { input }) => {
            const { ownerId, skipCount } = input;
            return await exec(() => getSavedPostsByUserIdDB(ownerId, skipCount));
        },
        getPostsByTitle: async(_, { input }) => {
            const { ownerId, title } = input;
            return await exec(() => getPostByTitleDB(title, ownerId));
        },
        getManyPostsByIds: async(_, { ids }) => {
            return await exec(() => getManyPostsByIdsDB(ids));
        },
    },
    Mutation: {
        addPost: async(_, { input }) => {
            return await exec(() => addPostDB(input));
        },
        updatePost: async(_, { input }) => {
            const { post, value, what } = input;
            return await exec(() => updatePostDB(post, value, what));
        },
        deletePostById: async(_, { _id }) => {
            return await exec(() => deletePostByIdDB(_id));
        },
        switchPostLike: async(_, { input }) => {
            const { userId, postId } = input;
            return await exec(() => switchPostLikeDB(userId, postId));
        },
        swicthPostInSaved: async(_, { input }) => {
            const { userId, postId } = input;
            return await exec(() => swicthPostInSavedDB(userId, postId));
        }
    }
}