const express = require('express')
const routes  = express.Router()

const ProfileController = require('../app/controllers/ProfileController')
const UserController    = require('../app/controllers/UserController')

const UserValidator = require('../app/validators/user')

const { onlyAdm, isAdmRedirectToAdmRoute } = require('../app/middlewares/session')

routes
  .get('/profile', isAdmRedirectToAdmRoute, UserValidator.indexProfile, ProfileController.index)
  .put('/profile', UserValidator.putProfile, ProfileController.put)

  .get('/users', onlyAdm, UserController.list)
  .get('/users/create', onlyAdm, UserController.create)
  .get('/users/:id/edit', onlyAdm, UserController.edit)

  .post('/users', UserValidator.post, UserController.post)
  .put('/users', UserValidator.put, UserController.put)
  .delete('/users', UserValidator.delete, UserController.delete)

module.exports = routes