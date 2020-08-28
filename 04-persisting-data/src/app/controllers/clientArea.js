const Client = require('../models/Client')
const { notFoundData } = require('../../lib/page404')

module.exports = {
  index(req, res) {
    Client.all("recipes", (recipes) => {
      return res.render('clientArea/index', { recipes })
    })
  },
  about(req, res) { 
    return res.render('clientArea/about')
  },
  recipes(req, res) {
    Client.all("recipes", (recipes) => {
      return res.render('clientArea/recipes-list', { recipes })
    })
  },
  recipeDetail(req, res) {
    Client.find("recipes", req.params.index, (recipe) => {
      if (!recipe) {
        return res.render('not-found', { notFoundData })
      }

      return res.render('clientArea/recipe-detail', { recipe })
    })
  },
  chefs(req, res) {
    Client.all("chefs", (chefs) => {
      return res.render('clientArea/chefs', { chefs })
    })
  },
  chefDetail(req, res) {
    Client.find("chefs", req.params.index, (chef) => {
      if(!chef) return res.send('Chef not found!')

      Client.findRecipes(chef.id, (recipes) => {
        return res.render('clientArea/chef-detail', { chef, recipes })
      })
    })
  },
  search(req, res) {
    const { filter } = req.query

    Client.findBy(filter, (recipes) => {

      return res.render('clientArea/search', { recipes, filter })
    })
  },
}