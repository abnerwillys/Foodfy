const express  = require('express')
const nunjucks = require('nunjucks')
const routes   = require('./routes')

const server = express()

//Middleware
server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(routes)

//Setting view engine (nunjucks)
server.set('view engine', 'njk')
nunjucks.configure('views', {
  express: server,
  autoescape: false,
  noCache: true
})

//Server door
server.listen(5000, () => {
  console.log('Server is Running')
})