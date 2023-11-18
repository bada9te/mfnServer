const postsModel = require('../models/posts/posts.model');

const addPostDB = async(post) => {
    let createdPost;
    await postsModel.addPost(post)
        .then(data => {
            createdPost = data[0];
        });
    return createdPost;
}

const updatePostDB = async(post, value, what) => {
    return await postsModel.updatePost(post, value, what);
}

const deletePostByIdDB = async(id) => {   
    return await postsModel.deletePostById(id);
}

const getPostByIdDB = async(id) => {
    return await postsModel.getPostById(id); 
}

const getAllPostsDB = async(range) => {
    return {
        posts: await postsModel.getAllPosts(range),
        count: await postsModel.getDocsCount({}),
    }
}

const getAllPostsWithOwnerIdDB = async(ownerId, range) => {
    return {
        posts: await postsModel.getAllWithOwnerId(ownerId, range),
        count: await postsModel.getDocsCount({ owner: ownerId }),
    }
}

const getSavedPostsByUserIdDB = async(userId, range) => {
    return {
        posts: await postsModel.getSavedPostsByUserId(userId, range),
        count: await postsModel.getDocsCount({ savedBy: userId }),
    }
}

const switchPostLikeDB = async(userId, postId) => {
    return await postsModel.switchIsLiked(postId, userId);
}

const getPostByTitleDB = async(title, userId, userIsOwner) => {
    let posts;
    if (userId) {
        posts = await postsModel.getByTitleWithUserId(title, userIsOwner, userId);
    } else {
        posts = await postsModel.getByTitle(title);
    }

    return posts;
}

const swicthPostInSavedDB = async(userId, postId) => {
    return await postsModel.switchInSaved(postId, userId);
}

const getManyPostsByIdsDB = async(ids) => {
    return await postsModel.getManyByIds(ids);
}


module.exports = {
    addPostDB,
    updatePostDB,
    deletePostByIdDB,
    getPostByIdDB,
    getAllPostsDB,
    getAllPostsWithOwnerIdDB,
    getSavedPostsByUserIdDB,
    switchPostLikeDB,
    getPostByTitleDB,
    swicthPostInSavedDB,
    getManyPostsByIdsDB,
}