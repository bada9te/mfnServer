import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageProductionDefault, ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { ApolloServer } from 'apollo-server-express';
import gqlSCHEMA from './schema';
import config from '../../config';
import http from "http";
import express from "express";
import { TExpressRequestWithPassport } from "./types";


// Set up ApolloServer.
const setupApollo = async(app: express.Express, httpServer: http.Server) => {
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
            const reqWithPassport = req as TExpressRequestWithPassport;
            
            return ({
                user: reqWithPassport.user,
                logIn: reqWithPassport.logIn,
                logout: reqWithPassport.logout,
                
                updateSessionUser: async(user) => {
                    reqWithPassport.session.passport.user = user;
                    reqWithPassport.session.save()
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

export default setupApollo;
