import { join } from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';


const typeDefs = loadFilesSync(join('**/*.graphql'));
const resolvers = loadFilesSync(join('**/*.resolvers.js'));

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;