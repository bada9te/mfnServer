const Comments = require('./comments.mongo');


// add
const addComment = async(comment) => {
    return await Comments.insertMany([comment])
    .catch((err) => {
        throw new Error(err)
    });
}

// get by id
const getById = async(id) => {
    return await Comments.findById(id, {
        '__v': 0,
    })
    .catch((err) => {
        throw new Error(err);
    });
}

// remove by id
const removeById = async(id) => {
    return await Comments.findOneAndDelete({ _id: id })
    .catch((err) => {
        throw new Error(err);
    });
}

// update by id
const updateById = async(id, value, what) => {
    return await Comments.findOneAndUpdate({ 
        _id: id 
    }, {
        [what]: value,
    }, {
        upsert: true,
    })
    .catch((err) => {
        throw new Error(err);
    });
}


// get all with id in array
const getAllWithIds = async(ids) => {
    return await Comments.find({
        _id: {"$in": ids},
        isReplyTo: null,
    }, { 
        '__v': 0 
    })
    .catch((err) => {
        throw new Error(err);
    });
}



module.exports = {
    addComment,
    getById,
    removeById,
    updateById,
    getAllWithIds,
}