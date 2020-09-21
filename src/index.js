import '@babel/polyfill/noConflict'
import server from './server'

server.listen(process.env.PORT || 4000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
})