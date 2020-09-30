const Client = require('../models/Client')
const File   = require('../models/File')

const { notFoundData } = require('../../lib/page404')

module.exports = {
  async index(req, res) {
    try {
      let results   = await Client.all("recipes")
      const recipes = results.rows

      if (recipes == "") return res.render('clientArea/index')

      const recipesPromises = recipes.map(recipe => File.find(recipe.id))
      results = await Promise.all(recipesPromises)
      
      for (let i = 0; i < recipes.length; i++) {
        let currentFile = results[i].rows[0]
        let fileTreated = {
          ...currentFile,
          src: `${req.protocol}://${req.headers.host}${currentFile.path.replace('public', "")}`
        }

        recipes[i] = {
          ...recipes[i], 
          file_recipe: fileTreated
        }
      }
      
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
        order: "created_at"
      }

      let results   = await Client.paginate(params)
      const recipes = results.rows

      const pagination = {
        totalPages: Math.ceil(recipes[0].total / limit),
        page
      }

      if (recipes == "") {
        const message = "Nenhuma receita cadastrada!"
        return res.render("clientArea/recipes-list", { message })
      
      } else {
        const recipesPromises = recipes.map(recipe => File.find(recipe.id))

        results = await Promise.all(recipesPromises)
        
        for (let i = 0; i < recipes.length; i++) {
          let currentFile = results[i].rows[0]
          let fileTreated = {
            ...currentFile,
            src: `${req.protocol}://${req.headers.host}${currentFile.path.replace('public', "")}`
          }

          recipes[i] = {
            ...recipes[i], 
            file_recipe: fileTreated
          }
        }
      }
      
      return res.render("clientArea/recipes-list", { recipes, pagination, filter })

    } catch (error) {
      console.error(error)
    }
  },
  async recipeDetail(req, res) {
    try {
      let results  = await Client.find("recipes", req.params.index)
      const recipe = results.rows[0]

      if (!recipe) return res.render('not-found', { notFoundData })

      results   = await File.find(recipe.id)
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
      let results = await Client.all("chefs")
      const chefs = results.rows
      
      if (chefs == "") {
        const message = "Nenhum chef cadastrado!"
        return res.render('clientArea/chefs', { message })

      } else {
        const chefsPromises = chefs.map(chef => Client.chefFiles(chef.file_id))
        results = await Promise.all(chefsPromises)
        
        for (let i = 0; i < chefs.length; i++) {
          let currentFile = results[i].rows[0]
          let fileTreated = {
            ...currentFile,
            src: `${req.protocol}://${req.headers.host}${currentFile.path.replace('public', "")}`
          }

          chefs[i] = {
            ...chefs[i], 
            file_chef: fileTreated
          }
        }
      }

      return res.render('clientArea/chefs', { chefs })

    } catch (error) {
      console.error(error)
    }
  },
  async chefDetail(req, res) {
    try {
      let results = await Client.find("chefs", req.params.index)
      const chef  = results.rows[0]

      if (!chef) return res.render('not-found', { notFoundData })

      results    = await Client.chefFiles(chef.file_id)
      const file = { 
        ...results.rows[0],
        src: `${req.protocol}://${req.headers.host}${results.rows[0].path.replace('public', "")}`
      } 
  
      results       = await Client.findRecipes(chef.id)
      const recipes = results.rows

      if (recipes == "") {
        const message = "Nenhuma receita cadastrada!"

        return res.render('clientArea/chef-detail', { chef, file, message })
      
      } else {
        const recipesPromises = recipes.map(recipe => File.find(recipe.id))

        results = await Promise.all(recipesPromises)
        
        for (let i = 0; i < recipes.length; i++) {
          let currentFile = results[i].rows[0]
          let fileTreated = {
            ...currentFile,
            src: `${req.protocol}://${req.headers.host}${currentFile.path.replace('public', "")}`
          }

          recipes[i] = {
            ...recipes[i], 
            file_recipe: fileTreated
          }
        }
      }

      return res.render('clientArea/chef-detail', { chef, recipes, file })

    } catch (error) {
      console.error(error)
    }
  },
  async search(req, res) {
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
        order: "updated_at"
      }

      let results    = await Client.paginate(params)
      const recipes  = results.rows
      let pagination = {}

      if (recipes == "") {
        const message = "Nenhuma receita cadastrada!"
        return res.render("clientArea/search", { message, filter })
      
      } else {
        pagination = {
          totalPages: Math.ceil(recipes[0].total / limit),
          page
        }

        const recipesPromises = recipes.map(recipe => File.find(recipe.id))

        results = await Promise.all(recipesPromises)
        
        for (let i = 0; i < recipes.length; i++) {
          let currentFile = results[i].rows[0]
          let fileTreated = {
            ...currentFile,
            src: `${req.protocol}://${req.headers.host}${currentFile.path.replace('public', "")}`
          }

          recipes[i] = {
            ...recipes[i], 
            file_recipe: fileTreated
          }
        }
      }
      
      return res.render("clientArea/search", { recipes, pagination, filter })

    } catch (error) {
      console.error(error)
    }
  },
}