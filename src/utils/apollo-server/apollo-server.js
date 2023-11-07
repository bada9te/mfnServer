const path = require('path');
const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } = require("apollo-server-core");
const { loadFilesSync } = require('@graphql-tools/load-files');
const { makeExecutableSchema } = require('@graphql-tools/schema');


// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};


const launchApollo = async(app) => {
  console.log('[APOLLO_GRAPHQL] Starting...');

  const typeDefs = loadFilesSync(path.join('**/*.graphql'));

  const APServer = new ApolloServer({
    typeDefs, 
    resolvers: null,
    plugins: [
      // Install a landing page plugin based on NODE_ENV
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault({
            graphRef: 'my-graph-id@my-graph-variant',
            footer: false,
          })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
  });
  
  await APServer.start()
    .then(() => {
      APServer.applyMiddleware({ app });
      console.log('[APOLLO_GRAPHQL] Ready on /graphql endpoint.');
    });
}


module.exports = launchApollo;