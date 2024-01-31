const { 
    ApolloServerPluginDrainHttpServer, 
    ApolloServerPluginLandingPageProductionDefault,
    ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const { ApolloServer }  = require('apollo-server-express');
const gqlSCHEMA         = require('./schema');
const config            = require('../../config');


// Set up ApolloServer.
const setupApollo = async(app, httpServer) => {
    const APServer = new ApolloServer({
        schema: gqlSCHEMA,
        plugins: [
            process.env.NODE_ENV === 'production'
            ? ApolloServerPluginLandingPageProductionDefault({
                graphRef: 'my-graph-id@my-graph-variant',
                footer: false,
            })
            : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({ httpServer }),
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
        },
    });
    
    console.log('[APOLLO_GRAPHQL] Starting...');
    await APServer.start()
        .then(() => {
            APServer.applyMiddleware({ 
                app, 
                cors: { 
                    origin: [config.base.clientBase, 'https://studio.apollographql.com'], 
                    credentials: true 
                }
            });
            console.log('[APOLLO_GRAPHQL] Ready on /graphql endpoint.');
        });
}

module.exports = setupApollo;
