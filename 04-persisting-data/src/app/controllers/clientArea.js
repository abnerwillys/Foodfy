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
    let { filter, page, limit } = req.query

    page  = page  || 1
    limit = limit || 9
    let offset = limit * (page - 1)

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(recipes) {
        try {  
          const pagination = {
            totalPages: Math.ceil(recipes[0].total / limit),
            page
          }
  
          return res.render("clientArea/recipes-list", { recipes, pagination, filter })

        } catch (error) {
          const message = "Nenhuma receita encontrada!"

          if (error) {
            console.log(error)
            return res.render("clientArea/recipes-list", { message })
          }
        }
      }
    }

    Client.paginate(params)
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
    let { filter, page, limit } = req.query

    page  = page  || 1
    limit = limit || 9
    let offset = limit * (page - 1)

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(recipes) {
        try {  
          const pagination = {
            totalPages: Math.ceil(recipes[0].total / limit),
            page
          }
  
          return res.render("clientArea/search", { recipes, pagination, filter })

        } catch (error) {
          const message = "Nenhuma receita encontrada!"

          if (error) {
            console.log(error)
            return res.render("clientArea/search", { message, filter })
          }
        }
      }
    }

    Client.paginate(params)
  },
}