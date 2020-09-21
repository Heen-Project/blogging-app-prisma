import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { createUser, getUsers, login, getProfile } from './utils/operations'

const client = getClient()

jest.setTimeout(30000)
beforeEach(seedDatabase)

test('Check create a new user', async () => {
    const variables = {
        data: {
            name: 'Wendy',
            email: 'wendy@example.test.com',
            password: 'Pass123!'
        }
    }
    const response = await client.mutate({ mutation: createUser, variables })
    const exists = await prisma.exists.User({ id: response.data.createUser.user.id })
    expect(exists).toBe(true)
})

test('Check exposed author profile', async () => {
    const response = await client.query({ query: getUsers })
    expect(response.data.users.length).toBe(2)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[0].name).toBe('Forest Resident')
})

// test('Check login with invalid credentials', async () => {
//     const variables = {
//         data: {
//             email: 'forest@example.com',
//             password: 'Woo!'
//         }
//     }
//     await expect(client.mutate({ mutation: login, variables })).rejects.toThrow()
// })

test('Check signup new user with invalid password', async () => {
    const variables = {
        data: {
            name: 'Ocean Wave',
            email: 'ocean@example.com',
            password: 'wave'
        }
    }
    await expect(client.mutate({ mutation: createUser, variables })).rejects.toThrow()
})

test('Check fetch user profile', async () => {
    const client =  getClient(userOne.jwt)
    const { data } = await client.query({ query: getProfile })
    expect(data.me.id).toBe(userOne.user.id)
    expect(data.me.name).toBe(userOne.user.name)
    expect(data.me.email).toBe(userOne.user.email)
})