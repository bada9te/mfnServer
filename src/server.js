const fs     = require('fs');
const app    = require('./app');
const path   = require('path');
const http   = require('http');
const config = require('./config');
const mongoose            = require('mongoose');
const { WebSocketServer } = require('ws');
const { useServer }       = require('graphql-ws/lib/use/ws');
const { 
    ApolloServerPluginDrainHttpServer, 
    ApolloServerPluginLandingPageProductionDefault,
    ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServer }      = require('@apollo/server');
const { MongodbPubSub }     = require('graphql-mongodb-subscriptions');
const removeJunkFiles       = require('./utils/cleaner/cleaner');
const gqlSCHEMA             = require('./utils/apollo-server/schema');


// server config
const PORT           = config.base.port || 8000;
const MONGO_URL      = config.mongo.url;
const MONGO_URL_TEST = config.mongo.url_test;

// http server
const SERVER = http.createServer(app);

// Create our WebSocket server using the HTTP server we just set up.
const wsSERVER = new WebSocketServer({
    server: SERVER,
    path: '/subscriptions',
});

// Save the returned server's info so we can shutdown this server later
const serverCleanup = useServer({ schema: gqlSCHEMA }, wsSERVER);


// Set up ApolloServer.
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
        ApolloServerPluginDrainHttpServer({ httpServer: SERVER }),
    
        // Proper shutdown for the WebSocket server.
        {
            async serverWillStart() {
                return {
                        async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
      ],
    context: ({req, res}) => {
        return ({
            user: req.user,
            logIn: req.logIn,
            logout: req.logout,
            pubsub: new MongodbPubSub(),

            updateSessionUser: async(user) => {
                req.session.passport.user = user;
                req.session.save()
            },
        });
    }
});

// prepare and launch server
const launchServer = async() => {
    // launch AP server
    await APServer.start();
    app.use('/graphql', expressMiddleware(APServer));

    // create a bunch of folders
    const uploadsTypes = ['audios', 'images', 'others'];
    const uploadsPath = path.join(__dirname, '..', 'uploads');
    createFolderAtPathIfNotExists(uploadsPath);

    uploadsTypes.forEach(type => {
        createFolderAtPathIfNotExists(path.join(uploadsPath, type));
    });

    // prepare mongoose events
    mongoose.connection.once('open', () => {
        console.log('[DB] MongoDB connection established.')
    });
    mongoose.connection.on('error', (err) => {
        console.error(`[DB] ${err}`);
    });

    console.log(`[DB] Connecting...`)
    // connect mongo
    await mongoose.connect(config.base.envType !== "test" ? MONGO_URL : MONGO_URL_TEST).catch(console.error);

    // clean junk
    await removeJunkFiles();

    // run server
    if (process.env.ENV_TYPE !== 'test') {
        SERVER.listen(PORT, () => {
            console.log(`[APP] Server is running on port ${PORT}...`);
        });
    }
}

// create folder at path 
const createFolderAtPathIfNotExists = (targetPath) => {
    if (!fs.existsSync(targetPath)) {
        console.log(`[FILESYSTEM] Creating folder at: ${targetPath}...`);
        fs.mkdirSync(targetPath);
        console.log(`[FILESYSTEM] ${targetPath} created.`);
    }
}

// launch 
launchServer();