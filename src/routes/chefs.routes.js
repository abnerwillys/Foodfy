const express = require('express')
const routes  = express.Router()

const multerChef = require('../app/middlewares/multerChef')

const ChefValidator   = require('../app/validators/chef')
const ChefsController = require('../app/controllers/ChefsController')

const { onlyAdm } = require('../app/middlewares/session')

routes
  .get('/chefs', ChefsController.index)
  .get('/chefs/create', onlyAdm, ChefsController.create)
  .get('/chefs/:id', ChefValidator.show, ChefsController.show)
  .get('/chefs/:id/edit', onlyAdm, ChefValidator.edit, ChefsController.edit)

  .post('/chefs', onlyAdm, multerChef.single('photo_chef'), ChefValidator.post, ChefsController.post)
  .put('/chefs', onlyAdm, multerChef.single('photo_chef'), ChefValidator.put, ChefsController.put)
  .delete('/chefs', onlyAdm, ChefsController.delete)

module.exports = routes
