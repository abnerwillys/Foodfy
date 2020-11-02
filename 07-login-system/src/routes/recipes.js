const express = require('express');
const routes  = express.Router();

const multerRecipe = require('../app/middlewares/multerRecipe');

const RecipeValidator = require('../app/validators/recipe');

const RecipesController = require('../app/controllers/RecipesController');

routes
  .get('/recipes', RecipesController.index)
  .get('/recipes/create', RecipesController.create)
  .get('/recipes/:id', RecipeValidator.show, RecipesController.show)
  .get('/recipes/:id/edit', RecipeValidator.edit, RecipesController.edit)

  .post('/recipes', multerRecipe.array('photos', 5), RecipeValidator.post, RecipesController.post)
  .put('/recipes', multerRecipe.array('photos', 5), RecipeValidator.put, RecipesController.put)
  .delete('/recipes', RecipesController.delete);

module.exports = routes;
