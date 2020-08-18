const data = require('../data.json')
const { notFoundData } = require('./page404')

exports.index = (req, res) => {
  return res.render('clientArea/index', { items: data.recipes })
}

exports.about = (req, res) => { 
  return res.render('clientArea/about')
}

exports.recipes = (req, res) => {
  return res.render('clientArea/recipes', { items: data.recipes })
}

exports.recipeDetail = (req, res) => {
  const recipeId = req.params.index

  if (!data.recipes[recipeId]) {
    return res.render('not-found', { notFoundData })
  }

  return res.render('clientArea/recipe-detail', { item: data.recipes[recipeId] })
}