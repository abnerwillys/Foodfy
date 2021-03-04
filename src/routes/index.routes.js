const express = require('express');
const routes = express.Router();

const { notFoundData } = require('../lib/page404');

const client  = require('./client.routes');
const session = require('./session.routes');
const users   = require('./users.routes');
const recipes = require('./recipes.routes');
const chefs   = require('./chefs.routes');
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
