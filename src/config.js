module.exports = {
    base: {
        port: 8000,
        clientBase: 'http://localhost:3000',
        cookieAccess1: 'ca1',
        cookieAccess2: 'ca2',
        sessionSecret: 'ss3',
        envType: 'development'
    },
    mongo: {
        url: 'mongodb://127.0.0.1:27017'
    },
    passport: {
        facebookAuth : {
            clientID	 : 'your-secret-clientID-here', // your App ID
            clientSecret : 'your-client-secret-here', // your App Secret
            callbackURL  : 'http://localhost:8080/auth/facebook/callback'
        },
    
        twitterAuth : {
            consumerKey    : 'your-consumer-key-here',
            consumerSecret : 'your-client-secret-here',
            callbackURL	   : 'http://localhost:8080/auth/twitter/callback'
        },
    
        googleAuth : {
            clientID     : 'your-secret-clientID-here',
            clientSecret : 'your-client-secret-here',
            callbackURL  : 'http://localhost:8080/auth/google/callback'
        }
    },
};