const { getPostByIdDB, getAllPostsDB, getAllPostsWithOwnerIdDB, getSavedPostsByUserIdDB, getPostByTitleDB, getManyPostsByIdsDB, addPostDB, updatePostDB, deletePostByIdDB, switchPostLikeDB, swicthPostInSavedDB } = require("../../db-reslovers/posts-db-resolver");
const exec = require("../../db-reslovers/execGQL");


module.exports = {
    Query: {
        getPostById: async(_, { _id }) => {
            return await exec(getPostByIdDB, { id: _id }); 
        },
        getAllPosts: async() => {
            return await exec(getAllPostsDB, {});
        },
        getAllPostsWithOwnerId: async(_, { input }) => {
            return await exec(getAllPostsWithOwnerIdDB, input);
        },
        getSavedPostsByUserId: async(_, { input }) => {
            return await exec(getSavedPostsByUserIdDB, input);
        },
        getPostsByTitle: async(_, { input }) => {
            return await exec(getPostByTitleDB, input);
        },
        getManyPostsByIds: async(_, { ids }) => {
            return await exec(getManyPostsByIdsDB, { ids });
        },
    },
    Mutation: {
        addPost: async(_, { input }) => {
            return await exec(addPostDB, input);
        },
        updatePost: async(_, { input }) => {
            return await exec(updatePostDB, input);
        },
        deletePostById: async(_, { _id }) => {
            return await exec(deletePostByIdDB, { id: _id });
        },
        switchPostLike: async(_, { input }) => {
            return await exec(switchPostLikeDB, input);
        },
        swicthPostInSaved: async(_, { input }) => {
            return await exec(swicthPostInSavedDB, input);
        }
    }
}