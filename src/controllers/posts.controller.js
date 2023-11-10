//const notificationsModel = require('../../models/notifications/notifications.model');
const { addPostDB, updatePostDB, deletePostByIdDB, getPostByIdDB, getAllPostsDB, getAllPostsWithOwnerIdDB, getSavedPostsByUserIdDB, switchPostLikeDB, getPostByTitleDB, swicthPostInSavedDB, getManyPostsByIdsDB } = require('../db-reslovers/posts-db-resolver');


// add post
const addPost = async(req, res, next) => {
    const post = req.body;
    
    try {
        const createdPost = await addPostDB(post);
        return res.status(200).json({
            done: true,
            post: createdPost,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


// update post 
const updatePost = async(req, res, next) => {
    const post  = req.body.post;
    const value = req.body.value;
    const what  = req.body.what;

    try {
        const updatedPost = await updatePostDB(post, value, what);
        return res.status(200).json({
            done: true,
            post: updatedPost,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


// delete post by id
const deletePostById = async(req, res, next) => {
    const id = req.body.id;
    try {
        const deletedPost = await deletePostByIdDB(id);
        return res.status(200).json({
            done: true,
            post: deletedPost,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


// get by id
const getPostById = async(req, res, next) => {
    const id = req.query.id;
    try {
        const post = await getPostByIdDB(id);

        return res.status(200).json({
            done: true,
            post,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


// get all posts
const getAllPosts = async(req, res, next) => {
    const skipCount = req.query.skipCount;
    try {
        const { posts, count } = await getAllPostsDB(skipCount);
        return res.status(200).json({
            done: true,
            posts: posts,
            count: count,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// by owner id 
const getAllWithOwnerId = async(req, res, next) => {
    const ownerId = req.query.id;
    const skipCount = req.query.skipCount;
    try {
        const { posts, count } = await getAllPostsWithOwnerIdDB(ownerId, skipCount);
        return res.status(200).json({
            done: true,
            posts: posts,
            count: count,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// saved posts by user id
const getSavedPostsByUserId = async(req, res, next) => {
    const userId = req.query.userId;
    const skipCount = req.query.skipCount;
    try {
        const { posts, count } = await getSavedPostsByUserIdDB(userId, skipCount);
        return res.status(200).json({
            done: true,
            count,
            posts,
        })
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// adds or removes like from a specific user
const switchLike = async(req, res, next) => {
    const userId = req.body.userId;
    const postId = req.body.postId;
    
    try {
        const post = await switchPostLikeDB(userId, postId);
            
        return res.status(201).json({
            done: true,
            post: post,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


const getByTitle = async(req, res, next) => {
    const title = req.query.title;
    const ownerId = req.query.ownerId;
    const isMine = req.query.isMine;

    try {
        const posts = await getPostByTitleDB(title, ownerId, isMine);
        
        return res.status(200).json({
            done: true,
            posts: posts,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// add post to saved
const swicthPostInSaved = async(req, res, next) => {
    const userId = req.body.userId;
    const postId = req.body.postId;

    try {
        const post = await swicthPostInSavedDB(userId, postId);

        return res.status(201).json({
            done: true,
            postId: postId,
            post: post,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// get many by ids
const getManyByIds = async(req, res, next) => {
    const ids = req.query.ids;
    //const skipCount = req.query.skipCount;

    try {
        const posts = await getManyPostsByIdsDB(ids);
        //const count = await postsModel.getDocsCount({ _id: {$in: ids} });

        return res.status(200).json({
            done: true,
            //count: count,
            posts: posts,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}



module.exports = {
    addPost,
    updatePost,
    deletePostById,
    getPostById,
    getAllPosts,
    getAllWithOwnerId,
    getSavedPostsByUserId,
    switchLike,
    getByTitle,
    swicthPostInSaved,
    getManyByIds,
}
