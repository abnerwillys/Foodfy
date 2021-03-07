const Chef   = require('../models/Chef')
const File   = require('../models/File')
const Recipe = require('../models/Recipe')

const { treatFilesFromData } = require('../../lib/useful')
const { notFoundData } = require('../../lib/page404')

module.exports = {
  async index(req, res) {
    try {
      let recipes = await Recipe.getAll()
      if (recipes == "") return res.render('clientArea/index')

      const recipesPromises = recipes.map(recipe => File.findRecipeFile(recipe.id))
      const results = await Promise.all(recipesPromises)

      recipes = treatFilesFromData('recipe', recipes, results, req)
      
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

      let recipes = await Recipe.paginated(params)
      if (recipes == "") {
        const message = "Nenhuma receita cadastrada!"
        return res.render("clientArea/recipes-list", { message })
      } 
      
      const recipesPromises = recipes.map(recipe => File.findRecipeFile(recipe.id))
      const results = await Promise.all(recipesPromises)

      recipes = treatFilesFromData('recipe', recipes, results, req)

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
      const recipe = await Recipe.findRecipe(req.params.id)
      if (!recipe) return res.render('not-found', { notFoundData })

      let results = await File.findRecipeFile(recipe.id)
      let files = results.rows
      files     = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
      }))

      return res.render('clientArea/recipe-detail', { recipe, files })

    } catch (error) {
      console.error(error)
    }
  },
  async chefs(req, res) {
    try {
      let chefs = await Chef.findAllGroupBy('id')
      if (chefs == "") {
        const message = "Nenhum chef cadastrado!"
        return res.render('clientArea/chefs-list', { message })
      } 
      
      const chefsPromises = chefs.map(chef => Chef.fileChef(chef.file_id))
      const results = await Promise.all(chefsPromises)

      chefs = treatFilesFromData('chef', chefs, results, req)

      return res.render('clientArea/chefs-list', { chefs })

    } catch (error) {
      console.error(error)
      return res.render('not-found', { notFoundData })
    }
  },
  async chefDetail(req, res) {
    try {
      const chef = await Chef.findChef(req.params.id)
      if (!chef) return res.render('not-found', { notFoundData })

      const file = await File.findById(chef.file_id)
      file.src   = `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
  
      let recipes = await Chef.findRecipesFromChef(chef.id, 'created_at')
      if (recipes == "") {
        const message = "Nenhuma receita cadastrada!"
        return res.render('clientArea/chef-detail', { chef, file, message })
      } 
      
      const recipesPromises = recipes.map(recipe => File.findRecipeFile(recipe.id))
      const results = await Promise.all(recipesPromises)
      
      recipes = treatFilesFromData('recipe', recipes, results, req)

      return res.render('clientArea/chef-detail', { chef, recipes, file })

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

      let recipes = await Recipe.paginated(params)
      if (recipes == "") {
        const message = "Nenhuma receita encontrada!"
        return res.render("clientArea/recipes-search", {
          message,
          filter: filter || 'Tudo'
        })
      } 
      
      const recipesPromises = recipes.map(recipe => File.findRecipeFile(recipe.id))
      const results = await Promise.all(recipesPromises)
      
      recipes = treatFilesFromData('recipe', recipes, results, req)

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