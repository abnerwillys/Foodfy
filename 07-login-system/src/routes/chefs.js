const express = require('express');
const routes  = express.Router();

const multerChef = require('../app/middlewares/multerChef');

const ChefValidator = require('../app/validators/chef');

const ChefsController = require('../app/controllers/ChefsController');

routes
  .get('/chefs', ChefsController.index)
  .get('/chefs/create', ChefsController.create)
  .get('/chefs/:id', ChefValidator.show, ChefsController.show)
  .get('/chefs/:id/edit', ChefValidator.edit, ChefsController.edit)

  .post('/chefs', multerChef.single('photo_chef'), ChefValidator.post, ChefsController.post)
  .put('/chefs', multerChef.single('photo_chef'), ChefValidator.put, ChefsController.put)
  .delete('/chefs', ChefsController.delete);

module.exports = routes;
