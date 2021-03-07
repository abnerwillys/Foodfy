const express = require('express')
const routes = express.Router()

const { notFoundData } = require('../lib/page404')

const client  = require('./client.routes')
const session = require('./session.routes')
const users   = require('./users.routes')
const recipes = require('./recipes.routes')
const chefs   = require('./chefs.routes')
const { onlyUsers } = require('../app/middlewares/session')

routes
  .use('', client)
  .use('/session', session)
  .use('/admin', onlyUsers, chefs)
  .use('/admin', onlyUsers, recipes)
  .use('/admin', onlyUsers, users)

  .use((req, res) => {
    res.status(404).render('not-found', { notFoundData })
  })

module.exports = routes
