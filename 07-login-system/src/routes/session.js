const express = require('express')
const routes  = express.Router()

const SessionController = require('../app/controllers/SessionController')

// const { isLoggedRedirectToUsers, onlyUsers } = require('../app/middlewares/session')
routes
// routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)
.get('/login', SessionController.loginForm)
// .post('/login', SessionValidator.login, SessionController.login)
// .post('/logout', SessionController.logout)

.get('/forgot-password', SessionController.forgotForm)
.get('/reset-password', SessionController.resetForm)
// .post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
// .post('/reset-password', SessionValidator.reset, SessionController.reset)

module.exports = routes