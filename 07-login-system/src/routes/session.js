const express = require('express')
const routes  = express.Router()

const SessionValidator  = require('../app/validators/session')
const SessionController = require('../app/controllers/SessionController')
const { isLoggedRedirectToUsers } = require('../app/middlewares/session')

routes
.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)
.post('/login', SessionValidator.login, SessionController.login)
.post('/logout', SessionController.logout)

.get('/forgot-password', isLoggedRedirectToUsers, SessionController.forgotForm)
.get('/reset-password', isLoggedRedirectToUsers, SessionController.resetForm)
.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
.post('/reset-password', SessionValidator.reset, SessionController.reset)

module.exports = routes