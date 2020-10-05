const Recipe = require('../models/Recipe')
const File   = require('../models/File')

const { notFoundData } = require('../../lib/page404')

module.exports = {
  async index(req, res) {
    try {
      let { filter, page, limit } = req.query

      page  = page  || 1
      limit = limit || 8
      let offset = limit * (page - 1)

      const params = {
        filter,
        page,
        limit,
        offset
      }

      let results   = await Recipe.paginate(params)
      const recipes = results.rows

      if (recipes == "") {
        const message = "Nenhuma receita cadastrada!"
        return res.render('adminRecipes/recipes-manager', { message })
      
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

      const pagination = {
        totalPages: Math.ceil(recipes[0].total / limit),
        page
      }
      
      return res.render("adminRecipes/recipes-manager", { recipes, pagination })

    } catch (error) {
      if (error) {
        console.log(error)
      }
    }
  },
  async create(req, res) {
    try {
      let results = await Recipe.chefSelectOptions()
      const chefOptions = results.rows
      
      return res.render('adminRecipes/recipe-create', { chefOptions })
      
    } catch (error) {
      console.error(error)
    }
  },
  async post(req, res) {
    try {
      if (req.body.information == "" || !req.body.information) {
        req.body.information = 'Sem informações adicionais.'
      }
  
      const keys = Object.keys(req.body)
      for(key of keys) {
        if(req.body[key] == "") return res.send('Please, fill all fields!')
      }
  
      if (req.files.length == 0) return res.send("Please, send at least one image!")
    
      let results  = await Recipe.create(req.body)
      const recipeId = results.rows[0].id
  
      const filesPromise = req.files.map(file => {
        File.createRecipeFile({ ...file, recipeId})
      })
  
      await Promise.all(filesPromise)
  
      return res.redirect(`/admin/recipes/${recipeId}`)

    } catch (error) {
      console.error(error)
    }
  },
  async show(req, res) {
    try {
      let results  = await Recipe.find(req.params.id)
      const recipe = results.rows[0]

      if(!recipe) return res.render('not-found', { notFoundData })

      results   = await File.find(recipe.id)
      let files = results.rows
      files     = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
      }))

      return res.render('adminRecipes/recipe-detail', { recipe, files })

    } catch (error) {
      console.error(error)
    }
  },
  async edit(req, res) {
    try {
      let results       = await Recipe.chefSelectOptions()
      const chefOptions = results.rows

      results      = await Recipe.find(req.params.id)
      const recipe = results.rows[0]
      
      if(!recipe) return res.send('Recipe not found!')

      results   = await File.find(recipe.id)
      let files = results.rows
      files     = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
      }))

      return res.render('adminRecipes/recipe-edit', { recipe, chefOptions, files })

    } catch (error) {
      console.error(error)
    }
  },
  async put(req, res) {
    try {
      if (req.body.information == "" || !req.body.information) {
        req.body.information = 'Sem informações adicionais.'
      }
  
      const keys = Object.keys(req.body)
      for(key of keys) {
        if (req.body[key] == "" && key != "removed_files") {
          return res.send("Please, fill all fields!")
        }
      }
  
      if (req.body.removed_files) {
        // 1,2,3,
        const removedFiles = req.body.removed_files.split(",") //[1,2,3, ]
        const lastIndex    = removedFiles.length - 1
        removedFiles.splice(lastIndex, 1) // [1,2,3]
  
        const removedFilesPromise = removedFiles.map(fileId => File.deleteRecipeFile(fileId))
  
        await Promise.all(removedFilesPromise)
      }
  
      if (req.files.length != 0) {
        const filesPromise = req.files.map(file => {
          File.createRecipeFile({ ...file, recipeId: req.body.id})
        })
    
        await Promise.all(filesPromise)
      }
  
      await Recipe.update(req.body)
  
      return res.redirect(`/admin/recipes/${req.body.id}`)

    } catch (error) {
      console.error(error)
    }
  },
  async delete(req, res) {
    try {
      let results = await File.find(req.body.id)
      let files   = results.rows

      const filesPromise = files.map(file => File.deleteRecipeFile(file.id))

      await Promise.all(filesPromise)

      await Recipe.delete(req.body.id)
      
      return res.redirect(`/admin/recipes`)
      
    } catch (error) {
      console.error(error)
    }
  },
}