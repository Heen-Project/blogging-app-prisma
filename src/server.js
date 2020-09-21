import { ApolloServer, PubSub } from 'apollo-server'
import { resolvers, fragmentReplacements } from './resolvers/index'
import typeDefs from './schema/schema'
import prisma from './prisma'

const pubsub = new PubSub()

const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    context(request) {
        return {
            pubsub,
            prisma,
            request
        }
    },
    fragmentReplacements,
    introspection: true,
    playground: true,
 })

 export { server as default }