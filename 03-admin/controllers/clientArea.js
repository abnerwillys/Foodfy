const dataRecipes = require('../data-recipes.js')
const { notFoundData } = require('./page404')


for (let recipe of dataRecipes) {
  if (!recipe.information) {
    recipe.information = 'Sem informações adicionais.'
  }
}

exports.index = (req, res) => {
  return res.render('clientArea/index', { items: dataRecipes })
}

exports.about = (req, res) => { 
  return res.render('clientArea/about')
}

exports.recipes = (req, res) => {
  return res.render('clientArea/recipes', { items: dataRecipes })
}

exports.recipeDetail = (req, res) => {
  const recipeId = req.params.index

  if (!dataRecipes[recipeId]) {
    return res.render('not-found', { notFoundData })
  }

  return res.render('clientArea/recipe-detail', { item: dataRecipes[recipeId] })
}