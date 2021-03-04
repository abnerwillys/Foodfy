const express = require('express')
const routes  = express.Router()

const ProfileController = require('../app/controllers/ProfileController')
const UserController    = require('../app/controllers/UserController')

const UserValidator = require('../app/validators/user')

routes
.get('/profile', UserValidator.indexProfile, ProfileController.index)
.put('/profile', UserValidator.putProfile, ProfileController.put)

.get('/users', UserValidator.onlyAdm, UserController.list)
.get('/users/create', UserValidator.onlyAdm, UserController.create)
.get('/users/:id/edit', UserValidator.onlyAdm, UserController.edit)

.post('/users', UserValidator.post, UserController.post)
.put('/users', UserValidator.put, UserController.put)
.delete('/users', UserValidator.delete, UserController.delete)

module.exports = routes