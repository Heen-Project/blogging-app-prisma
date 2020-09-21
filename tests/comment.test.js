import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDatabase, { userOne, commentOne, commentTwo } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { deleteComment } from './utils/operations'

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