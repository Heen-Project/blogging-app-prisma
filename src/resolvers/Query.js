// --- prisma.query, three possible input for second function 
// 1. null: (provide no argument) return all the scalar type (exclude all the relational data)
// 2. string: (provide a string of graphql query) define what we need, we need to know what we need
// 3. object: (provide an object) using an object that was created for us (object named 'info' in the parameter)
import getUserId from '../utils/getUserId'

const Query = {
    users(parent, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after
        }
        if (args.query) {
            opArgs.where = {
                name_contains: args.query
            }
        }
        return prisma.query.users(opArgs, info)
    },
    posts(parent, args, { prisma }, info) {
        const opArgs = {
            where: {
                published: true
            },
            first: args.first,
            skip: args.skip,
            after: args.after
        }
        if (args.query) {
            opArgs.where.OR = [{
                OR: [{
                    body_contains: args.query
                }, {
                    title_contains: args.query
                }]
            } ]
        }
        return prisma.query.posts(opArgs, info)
    },
    myPosts(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const opArgs = {
            where: {
                author: {
                    id: userId
                }
            },
            first: args.first,
            skip: args.skip,
            after: args.after
        }
        if (args.query) {
            opArgs.where.OR = [{
                OR: [{
                    body_contains: args.query
                }, {
                    title_contains: args.query
                }]
            } ]
        }
        return prisma.query.posts(opArgs, info)
    },
    comments(parent, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after
        }
        return prisma.query.comments(opArgs, info)
    },
    me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        return prisma.query.user({
            where: {
                id: userId
            }
        }, info)
    },
    async post(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false)
        const posts = await prisma.query.posts({
            where: {
                id: args.id,
                OR: [{
                    published: true
                }, {
                    author: {
                        id: userId
                    }
                }]
            }
        }, info)
        if (posts.length === 0) {
            throw new Error('Post not found')
        }
        return posts[0]
    }
}

export { Query as default }