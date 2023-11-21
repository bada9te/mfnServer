const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } = require("apollo-server-core");
const { loadFilesSync } = require('@graphql-tools/load-files');


const launchApollo = async(app) => {
  console.log('[APOLLO_GRAPHQL] Starting...');

  const typeDefs = loadFilesSync(path.join('**/*.graphql'));
  const resolvers = loadFilesSync(path.join('**/*.resolvers.js'))

  const APServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault({
          graphRef: 'my-graph-id@my-graph-variant',
          footer: false,
        })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
    context: ({ req }) => {
      return {
        user: req.user,
      }
    }
  });
  
  await APServer.start()
    .then(() => {
      APServer.applyMiddleware({ app });
      console.log('[APOLLO_GRAPHQL] Ready on /graphql endpoint.');
    });
}


module.exports = launchApollo;