const { 
  ApolloServerPluginLandingPageLocalDefault, 
  ApolloServerPluginLandingPageProductionDefault 
}                              = require("apollo-server-core");
const { ApolloServer }         = require('apollo-server-express');
const config                   = require('../../config');
//const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');

const CLIENT_BASE = config.base.clientBase;


const launchApollo = async(app) => {
  console.log('[APOLLO_GRAPHQL] Starting...');

  const APServer = new ApolloServer({
    schema: require('./schema'),
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault({
          graphRef: 'my-graph-id@my-graph-variant',
          footer: false,
        })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
    context: ({req, res}) => {
      return ({
        user: req.user,
        logIn: req.logIn,
        logout: req.logout,

        updateSessionUser: async(user) => {
          req.session.passport.user = user;
          req.session.save()
        },
      });
    }
  });
  
  await APServer.start()
    .then(() => {
      APServer.applyMiddleware({ 
        app, 
        cors: { 
          origin: [CLIENT_BASE, 'https://studio.apollographql.com'], 
          credentials: true 
        }
      });
      console.log('[APOLLO_GRAPHQL] Ready on /graphql endpoint.');
    });
}


module.exports = launchApollo;