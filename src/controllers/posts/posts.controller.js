//const notificationsModel = require('../../models/notifications/notifications.model');
const postsModel = require('../../models/posts/posts.model');


// add post
const addPost = async(req, res, next) => {
    const post = req.body;
    
    try {
        await postsModel.addPost(post);
        return res.status(200).json({
            done: true,
            post: post,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


// update post 
const updatePost = async(req, res, next) => {
    const post  = req.body.post;
    let   value = req.body.value;
    const what  = req.body.what;

    
    try {
        await postsModel.updatePost(post, value, what);
        return res.status(200).json({
            done: true,
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
        await postsModel.deletePostById(id);
        return res.status(200).json({
            done: true,
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
        const post = await postsModel.getPostById(id);

        return res.status(200).json({
            done: true,
            post: post,
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
        const posts = await postsModel.getAllPosts(skipCount);
        const count = await postsModel.getDocsCount({});
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
        const posts = await postsModel.getAllWithOwnerId(ownerId, skipCount);
        const count = await postsModel.getDocsCount({ owner: ownerId });
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
        const posts = await postsModel.getSavedPostsByUserId(userId, skipCount);
        return res.status(200).json({
            done: true,
            posts: posts,
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
        const post = await postsModel.switchIsLiked(postId, userId);
            
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


const getByTitle = async(req, res, next) => {
    const title = req.query.title;
    const ownerId = req.query.ownerId;
    const isMine = req.query.isMine;

    try {
        let posts = null;
        if (ownerId && isMine) {
            posts = await postsModel.getByTitleWithOwnerId(title, isMine, ownerId);
        } else {
            posts = await postsModel.getByTitle(title);
        }
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
        const post = await postsModel.switchInSaved(postId, userId);

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
}
