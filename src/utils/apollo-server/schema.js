const path                     = require('path');
const { loadFilesSync }        = require('@graphql-tools/load-files');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const typeDefs = loadFilesSync(path.join('**/*.graphql'));
const resolvers = loadFilesSync(path.join('**/*.resolvers.js'));

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;