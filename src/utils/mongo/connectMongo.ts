import mongoose from 'mongoose';
import config from '../../config';


const MONGO_URL      = config.mongo.url;
const MONGO_URL_TEST = config.mongo.url_test;

const connectMongo = async() => {
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
}

export default connectMongo;