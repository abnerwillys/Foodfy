const express = require('express')
const routes  = express.Router()

const { notFoundData } = require('../lib/page404')

const client = require('./client')
const users  = require('./users')
const admin  = require('./admin')

routes.use('', client)
routes.use('/admin', admin)
routes.use('/admin', users)

routes.use((req, res) => {
  res.status(404).render('not-found', { notFoundData })
})

module.exports = routes
