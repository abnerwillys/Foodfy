const express = require('express')
const routes  = express.Router()

const ProfileController = require('../app/controllers/ProfileController')
const UserController    = require('../app/controllers/UserController')


// Rotas de perfil de um usuário logado
routes
.get('/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
.put('/profile', ProfileController.put)// Editar o usuário logado

.get('/users', UserController.list)
.get('/users/create', UserController.create)
.get('/users/:id/edit', UserController.edit)

.post('/users', UserController.post)
.put('/users', UserController.put)
.delete('/users', UserController.delete)


module.exports = routes