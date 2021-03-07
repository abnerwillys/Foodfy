
const express = require('express')
const routes  = express.Router()

const ClientController = require('../app/controllers/ClientController')

routes
  .get('/', ClientController.index)
  .get('/about', ClientController.about)
  .get('/recipes', ClientController.recipes)
  .get('/recipes/:id', ClientController.recipeDetail)
  .get('/chefs', ClientController.chefs)
  .get('/chefs/:id', ClientController.chefDetail)
  .get('/search/recipes', ClientController.search)

module.exports = routes