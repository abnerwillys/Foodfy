// const dataRecipes = require('../data-recipes.js')
const fs = require('fs')
const { recipes } = require('../data.json')
const { notFoundData } = require('./page404')


for (let recipe of recipes) {
  if (!recipe.information) {
    recipe.information = 'Sem informações adicionais.'
  }
}

exports.index = (request, response) => {
  return response.render('adminArea/recipes-manager', { items: recipes })
}

exports.create = (request, response) => {
  return response.render('adminArea/recipes-create')
}

exports.show = (request, response) => {
  const recipeId = request.params.id

  if (!recipes[recipeId]) {
    return response.render('not-found', { notFoundData })
  }

  const chosenRecipe = {
    ...recipes[recipeId],
    id: recipeId,
  }

  return response.render('adminArea/recipes-show', { item: chosenRecipe })
}

exports.edit = (request, response) => {
  const recipeId = request.params.id

  if (!recipes[recipeId]) {
    return response.render('not-found', { notFoundData })
  }

  const chosenRecipe = {
    ...recipes[recipeId],
    id: recipeId,
  }

  return response.render('adminArea/recipes-edit', { item: chosenRecipe })
}

exports.post = (request, response) => {
  console.log(request.body)

  return response.send(request.body)
}

exports.put = (request, response) => {
  return response.send("Hi, that is the put's page")
}

exports.delete = (request, response) => {
  return response.send("Hi, that is the delete page")
}