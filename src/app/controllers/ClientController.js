const LoadRecipeService = require('../services/LoadRecipeService')
const LoadChefService   = require('../services/LoadChefService')

const { notFoundData } = require('../../lib/page404')

module.exports = {
  async index(req, res) {
    try {
      const recipes = await LoadRecipeService.load('recipes', { params: {}, req })
      if (recipes == "") return res.render('clientArea/index')
      
      return res.render('clientArea/index', { recipes })

    } catch (error) {
      console.error(error)
    }
  },
  about(req, res) { 
    return res.render('clientArea/about')
  },
  async recipes(req, res) {
    try {
      let { filter, page, limit } = req.query

      page  = page  || 1
      limit = limit || 9
      let offset = limit * (page - 1)

      const params = {
        filter,
        page,
        limit,
        offset,
        orderBy: "created_at",
        isDesc: true
      }

      const recipes = await LoadRecipeService.load('recipes', { params, req })
      if (recipes == "") {
        const message = "Nenhuma receita cadastrada!"
        return res.render("clientArea/recipes-list", { message })
      } 

      const pagination = {
        totalPages: Math.ceil(recipes[0].total / limit),
        page
      }
      
      return res.render("clientArea/recipes-list", { recipes, pagination, filter })

    } catch (error) {
      console.error(error)
      return res.render('not-found', { notFoundData })
    }
  },
  async recipeDetail(req, res) {
    try {
      const { recipe, files } = await LoadRecipeService.load('recipe', { id: req.params.id , req})
      if (!recipe) return res.render('not-found', { notFoundData })

      return res.render('clientArea/recipe-detail', { recipe, files })

    } catch (error) {
      console.error(error)
    }
  },
  async chefs(req, res) {
    try {
      const chefs = await LoadChefService.load('chefs', { req, isClient: true })
      if (chefs == "") {
        const message = "Nenhum chef cadastrado!"
        return res.render('clientArea/chefs-list', { message })
      } 

      return res.render('clientArea/chefs-list', { chefs })

    } catch (error) {
      console.error(error)
      return res.render('not-found', { notFoundData })
    }
  },
  async chefDetail(req, res) {
    try {
      const { chef, file, recipes } = await LoadChefService.load('chef', {
        id: req.params.id,
        req,
        isClient: true
      })

      if (!chef) return res.render('not-found', { notFoundData })

      if (recipes == "") {
        const message = "Nenhuma receita cadastrada!"
        return res.render('clientArea/chef-detail', { chef, file, message })
      } 
      return res.render('clientArea/chef-detail', { chef, file, recipes })

    } catch (error) {
      console.error(error)
    }
  },
  async search(req, res) {
    try {
      let { filter, page, limit } = req.query
      if (!filter || filter.toLowerCase() === 'tudo') filter = null

      page  = page  || 1
      limit = limit || 9
      let offset = limit * (page - 1)

      const params = {
        filter,
        page,
        limit,
        offset,
        orderBy: "updated_at",
        isDesc: true
      }
      
      const recipes = await LoadRecipeService.load('recipes', { params, req })
      if (recipes == "") {
        const message = "Nenhuma receita encontrada!"
        return res.render("clientArea/recipes-search", {
          message,
          filter: filter || 'Tudo'
        })
      } 
      
      const pagination = {
        totalPages: Math.ceil(recipes[0].total / limit),
        page
      }
      
      return res.render("clientArea/recipes-search", {
        recipes,
        pagination,
        filter: filter || 'Tudo'
      })

    } catch (error) {
      console.error(error)
    }
  },
}