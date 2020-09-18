// import { gql } from 'apollo-server'
// import fs from 'fs'
// import path from 'path'

// const typeDefs = gql`
//     ${fs.readFileSync(path.resolve(__dirname, 'schema.graphql'), 'utf8')}
// `

import path from 'path'
import { importSchema } from 'graphql-import'

const typeDefs = importSchema(path.resolve(__dirname, 'schema.graphql'))

export default typeDefs
