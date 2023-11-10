const { GraphQLError } = require("graphql");

module.exports = async(func) => {
    try {
        return await func();        
    } catch (error) {
        console.log(error)
        throw new GraphQLError(error.msg);
    }
}