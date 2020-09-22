import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDatabase, { userOne, commentOne, commentTwo, postOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { deleteComment, subscribeToComments } from './utils/operations'

const client = getClient()

jest.setTimeout(30000)
beforeEach(seedDatabase)

test('Check delete owned comment', async () => {
    const client =  getClient(userOne.jwt)
    const variables = {
        id: commentTwo.comment.id
    }
    await client.mutate({ mutation: deleteComment, variables })
    const exists = await prisma.exists.Comment({ id: commentTwo.comment.id })
    expect(exists).toBe(false )
})

test('Check delete others comment', async () => {
    const client =  getClient(userOne.jwt)
    const variables = {
        id: commentOne.comment.id
    }
    await expect(client.mutate({ mutation: deleteComment, variables })).rejects.toThrow()
})

test('Check subscribe to comments for a post', async (done) => {
    const client =  getClient(userOne.jwt)
    const variables = {
        postId: postOne.post.id
    }
    client.subscribe({ query: subscribeToComments, variables }).subscribe({
        next(response){
            expect(response.data.comment.mutation).toBe('DELETED')
            done()
        }
    })

    await prisma.mutation.deleteComment({ where: { id: commentOne.comment.id } })
})

// Check should fetch post comments
// Check should create a new comment
// Check should not create comment on draft post
// Check should update comment
// Check should not update another users comment
// Check should not delete another users comment
// Check should require authentication to create a comment (could add for update and delete too)