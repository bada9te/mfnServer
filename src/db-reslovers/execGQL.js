module.exports = async(func, args) => {
    try {
        return await func(...args);        
    } catch (error) {
        throw new GraphQLError(error.msg);
    }
}