const { addCommentDB, getManyCommentsByIdsDB, getOneCommentByIdDB, removeCommentByIdDB } = require('../db-reslovers/comments-db-resolver');


// add / create comment
const addComment = async(req, res, next) => {
    const comment = req.body.comment;

    try {
        const createdComment = await addCommentDB(comment);
        return res.status(201).json({
            done: true,
            comment: createdComment,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

const getManyByIds = async(req, res, next) => {
    const ids = req.body.ids;

    try {
        const comments = await getManyCommentsByIdsDB(ids);
        return res.status(200).json({
            done: true,
            comments: comments,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

const getOneById = async(req, res, next) => {
    const id = req.query.id;

    try {
        const comment = await getOneCommentByIdDB(id);
        return res.status(200).json({
            done: true,
            comment,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


const removeById = async(req, res, next) => {
    const id = req.body.id;

    try {
        const comment = await removeCommentByIdDB(id);
        return res.status(200).json({
            comment,
            done: true,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


module.exports = {
    addComment,
    getManyByIds,
    getOneById,
    removeById,
}
