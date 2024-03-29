import Comments from './comments.mongo';
import { TNewComment } from './types';


// add
const addComment = async(comment: TNewComment) => {
    return await Comments.insertMany([comment])
}

// get by id
const getById = async(id: string) => {
    return await Comments.findById(id, {
        '__v': 0,
    })
}

// remove by id
const removeById = async(id: string) => {
    return await Comments.findOneAndDelete({ _id: id })
}

// update by id
const updateById = async(id: string, value: string, what: any) => {
    return await Comments.findOneAndUpdate({ 
        _id: id 
    }, {
        [what]: value,
    }, {
        upsert: true,
    })
}

// remove many by ids
const removeManyByIds = async(ids: string[]) => {
    return await Comments.deleteMany({_id: {"$in": ids} })
}


// get all with id in array
const getAllWithIds = async(ids: string[]) => {
    return await Comments.find({
        _id: {"$in": ids},
        isReplyTo: null,
    }, { 
        '__v': 0 
    })
}


const getCommentReplies = async(id: string) => {
    return await Comments.findById(
        id, 
        { populate: "replies" }
    ).select({ 
        "replies": 1, 
        "_id": 0,
        "__v": 0,
        "owner": 0,
    })
}

const getCommentsByPostId = async(postId: string) => {
    return await Comments.find({
        post: postId
    })
    .sort({ createdAt: -1 })
}



export {
    addComment,
    getById,
    removeById,
    updateById,
    removeManyByIds,
    getAllWithIds,
    getCommentReplies,
    getCommentsByPostId,
}