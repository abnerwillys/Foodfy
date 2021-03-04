const express = require('express');
const routes = express.Router();

const { notFoundData } = require('../lib/page404');

const client  = require('./client');
const session = require('./session');
const users   = require('./users');
const recipes = require('./recipes');
const chefs   = require('./chefs');
const { onlyUsers } = require('../app/middlewares/session')

routes.use('', client);
routes.use('/session', session);
routes.use('/admin', onlyUsers, chefs);
routes.use('/admin', onlyUsers, recipes);
routes.use('/admin', onlyUsers, users);

routes.use((req, res) => {
  res.status(404).render('not-found', { notFoundData });
});

module.exports = routes;
