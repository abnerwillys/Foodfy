const express = require('express');
const routes = express.Router();

const { notFoundData } = require('../lib/page404');

const client  = require('./client');
const session = require('./session');
const users   = require('./users');
const recipes = require('./recipes');
const chefs   = require('./chefs');

routes.use('', client);
routes.use('/session', session);
routes.use('/admin', chefs);
routes.use('/admin', recipes);
routes.use('/admin', users);

routes.use((req, res) => {
  res.status(404).render('not-found', { notFoundData });
});

module.exports = routes;
