const mongoose = require('mongoose');
const Post = require('./posts.mongo');


// add post
const addPost = async(post) => {
    return await Post.insertMany([post])
    .catch((err) => {
        throw new Error(err);
    });
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
    .catch((err) => {
        throw new Error(err);
    });
}

// delete post
const deletePostById = async(id) => {
    return await Post.findOneAndDelete({ _id: id, })
    .catch((err) => {
        throw new Error(err);
    });
}

// delete many posts
const deletePostsByIds = async(ids) => {
    return await Post.deleteMany({ _id: ids })
    .catch((err) => {
        throw new Error(err);
    });
}

// get post
const getPostById = async(id) => {
    return await Post.findById(id, { 
        '__v': 0, 
    })
    .catch((err) => {
        throw new Error(err);
    });
}

// get all posts
const getAllPosts = async(range) => {
    return await Post.find({}, { 
        '__v': 0, 
    })
    .skip(range.offset)
    .limit(range.limit)
    .catch((err) => {
        throw new Error(err);
    });
}

const getAllWithOwnerId = async(id, range) => {
    return await Post.find({owner: id}, {
        '__v': 0,
    })
    .skip(range.offset)
    .limit(range.limit)
    .catch((err) => {
        throw new Error(err);
    });
}

const getSavedPostsByUserId = async(userId, range) => {
    return await Post.find({ savedBy: userId }, {
        '__v': 0,
    })
    .skip(range.offset)
    .limit(range.limit)
    .catch((err) => {
        throw new Error(err);
    });
}

const getByTitle = async(title) => {
    return await Post.find({title: { $regex: '.*' + title + '.*' }}, {
        '__v': 0,
    })
    .catch((err) => {
        throw new Error(err);
    });
}

// by title and owner id
const getByTitleWithUserId = async(title, useOwnerId, userId) => {
    return await Post.find({
        title: { $regex: '.*' + title + '.*' },
        owner: useOwnerId === 'true' ? userId : { "$ne": userId }
    }, {
        '__v': 0,
    })
    .catch((err) => {
        throw new Error(err);
    });
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
    .catch((err) => {
        throw new Error(err);
    });
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
    .catch((err) => {
        throw new Error(err);
    });
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
    .catch((err) => {
        throw new Error(err);
    });
}


const getManyByIds = async(ids) => {
    return await Post.find({_id: { "$in": ids }}, {
        '__v': 0,
    })
    .catch((err) => {
        throw new Error(err);
    });
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
    .catch((err) => {
        throw new Error(err);
    });
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
}