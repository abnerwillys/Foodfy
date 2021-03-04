const express  = require('express');
const nunjucks = require('nunjucks');
const routes   = require('./routes');
const session  = require('./config/session');
const methodOverride = require('method-override');

const server = express();

server
.use(session)
.use((req, res, next) => {
  res.locals.session = req.session;
  next();
})
.use(express.urlencoded({ extended: true }))
.use(express.static('public'))
.use(methodOverride('_method'))
.use(routes);

server.set('view engine', 'njk');
nunjucks.configure('src/app/views', {
  express: server,
  noCache: true,
  autoescape: false,
  noCache: true,
});

server.listen(5000, () => {
  console.log('Server is Running!');
});
