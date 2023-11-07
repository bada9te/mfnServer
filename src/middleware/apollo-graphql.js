const { ApolloServer, gql } = require('apollo-server-express');
//const app = require('../app');


// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};


const launchApollo = async(app) => {
    console.log('[APOLLO_GRAPHQL] Applying...');
    const APServer = new ApolloServer({typeDefs, resolvers});
    
    await APServer.start()
    .then(() => {
        APServer.applyMiddleware({ app });
        console.log('[APOLLO_GRAPHQL] Applied, ready on /graphql endpoint.');
    });
}

module.exports = launchApollo;