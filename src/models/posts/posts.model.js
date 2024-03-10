const mongoose = require('mongoose');
const Post = require('./posts.mongo');
const postsModel = require('./posts.mongo');


// add post
const addPost = async(post) => {
    return await Post.insertMany([post])
}

// update post
const updatePost = async(id, value, what) => {
    return await Post.findOneAndUpdate({
        _id: id,
    }, {
        [what]: value,
    }, {
        upsert: true,
        new: true,
    })
}

// delete post
const deletePostById = async(id) => {
    return await Post.findOneAndDelete({ _id: id, })
}

// delete many posts
const deletePostsByIds = async(ids) => {
    return await Post.deleteMany({ _id: ids })
}

// get post
const getPostById = async(id) => {
    return await Post.findById(id, { 
        '__v': 0, 
    })
}

// get all posts
const getAllPosts = async(range) => {
    return await Post.find({}, { 
        '__v': 0, 
    })
    .skip(range.offset)
    .limit(range.limit)
    .sort({ createdAt: -1 })
}

const getAllWithOwnerId = async(id, range) => {
    return await Post.find({owner: id}, {
        '__v': 0,
    })
    .skip(range.offset)
    .limit(range.limit)
    .sort({ createdAt: -1 })
}

const getSavedPostsByUserId = async(userId, range) => {
    return await Post.find({ savedBy: userId }, {
        '__v': 0,
    })
    .skip(range.offset)
    .limit(range.limit)
    .sort({ createdAt: -1 })
}

const getByTitle = async(title) => {
    return await Post.find({title: { $regex: '.*' + title + '.*' }}, {
        '__v': 0,
    })
}

// by title and owner id
const getByTitleWithUserId = async(title, useOwnerId, userId) => {
    return await Post.find({
        title: { $regex: '.*' + title + '.*' },
        owner: useOwnerId === true ? userId : { "$ne": userId }
    }, {
        '__v': 0,
    })
}

// count docs
const getDocsCount = async(filter) => {
    return await Post.countDocuments(filter).exec()
    .catch((err) => {
        throw new Error(err);
    })
}

const getOnlyImagesAndAudios = async() => {
    return await Post.find(
        {},
        { 'image': 1, 'audio': 1}
    )
}

// switch saved
const switchInSaved = async(postId, userId) => {
    userId = new mongoose.Types.ObjectId(userId);
    return await Post.findOneAndUpdate({ _id: postId }, [{
            $set: {
                savedBy: {
                    $cond: [
                        { $in: [userId, "$savedBy"] },
                        { $setDifference: ["$savedBy", [userId]] },
                        { $concatArrays: ["$savedBy", [userId]] }
                    ]
                }
            }
        }],
        { new: true }
    )
}

// switch liked
const switchIsLiked = async(postId, userId) => {
    userId = new mongoose.Types.ObjectId(userId);
    return await Post.findOneAndUpdate({ _id: postId }, [{
            $set: {
                likedBy: {
                    $cond: [
                        { $in: [userId, "$likedBy"] },
                        { $setDifference: ["$likedBy", [userId]] },
                        { $concatArrays: ["$likedBy", [userId]] }
                    ]
                }
            }
        }],
        { new: true }
    )
}


const getManyByIds = async(ids) => {
    return await Post.find({_id: { "$in": ids }}, {
        '__v': 0,
    })
}


const addOrRemoveComment = async(postId, commentId) => {
    return await Post.findOneAndUpdate({ _id: postId }, [{
            $set: {
                comments: {
                    $cond: [
                        { $in: [commentId, "$comments"] },
                        { $setDifference: ["$comments", [commentId]] },
                        { $concatArrays: ["$comments", [commentId]] },
                    ]
                }
            }
        }],
        { new: true }
    )
}


const getMostPopularPostsByStartDate = async(date) => {
    return await Post.aggregate([
        {
            $match: {
                createdAt: { $gte: date }
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner'
            }
        },
        {
            $set: {
                owner: { $first: "$owner" }
            }
        },
        {
            $addFields: {
                score: { $sum: [{ $size: "$likedBy" }, {$size: "$savedBy"}] }
            }
        },
    ]).sort({ score: -1 }).limit(3)
}


const getPostsByCategory = async(category, range) => {
    return await Post.find({ category }, {
        '__v': 0,
    })
    .skip(range.offset)
    .limit(range.limit)
    .sort({ createdAt: -1 })
}


module.exports = {
    addPost, 
    updatePost,
    deletePostById,
    deletePostsByIds,
    getPostById,
    getAllPosts,
    getAllWithOwnerId,
    getSavedPostsByUserId,
    getByTitle,
    getByTitleWithUserId,
    getDocsCount,
    getOnlyImagesAndAudios,
    switchInSaved,
    switchIsLiked,
    addOrRemoveComment,
    getManyByIds,
    getMostPopularPostsByStartDate,
    getPostsByCategory,
}