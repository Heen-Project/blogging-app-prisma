import 'cross-fetch/polyfill'
import ApolloClient, { gql } from 'apollo-boost'
import bycript from 'bcryptjs'
import prisma from '../src/prisma'

const client = new ApolloClient({
    uri: 'http://localhost:4000'
})

jest.setTimeout(30000)

beforeEach(async () => {
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()
    const user = await prisma.mutation.createUser({
        data: {
            name: 'Forest Resident',
            email: 'forest@example.com',
            password: bycript.hashSync('Pass123!')
        }
    })
    await prisma.mutation.createPost({
        data: {
            title: 'My Published Post!',
            body: 'This is a regular post',
            published: true,
            author: {
                connect: {
                    id: user.id
                }
            }
        }
    })
    await prisma.mutation.createPost({
        data: {
            title: 'My Draft Post!',
            body: 'This is a draft post',
            published: false,
            author: {
                connect: {
                    id: user.id
                }
            }
        }
    })
})

test('Check create a new user', async () => {
    const createUser = gql`
        mutation {
            createUser (
                data: {
                    name: "Wendy"
                    email: "wendy@example.test.com"
                    password: "Pass123!"
                }
            ){
                user {
                    id
                }
                token
            }
        }
    `
    const response = await client.mutate({ mutation: createUser })
    const exists = await prisma.exists.User({ id: response.data.createUser.user.id })

    expect(exists).toBe(true)
})