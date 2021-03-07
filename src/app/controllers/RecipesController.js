const Recipe = require('../models/Recipe')
const File   = require('../models/File')
const { treatFilesFromData } = require('../../lib/useful')

function treatFieldInformation(body) {
  if (body.information == '' || !body.information) {
    body.information = 'Sem informações adicionais.'
  }
}

module.exports = {
  async index(req, res) {
    try {
      const { error, success } = req.session
      req.session.error   = ''
      req.session.success = ''

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

      let recipes = await Recipe.paginated(params)
      if (recipes == "") {
        const message = "Nenhuma receita cadastrada!"
        return res.render('adminRecipes/recipes-manager', { message, error, success })
      } 
      
      const recipesPromises = recipes.map(recipe => File.findRecipeFile(recipe.id))
      const results = await Promise.all(recipesPromises)

      recipes = treatFilesFromData('recipe', recipes, results, req)

      const pagination = {
        totalPages: Math.ceil(recipes[0].total / limit),
        page
      }
      
      return res.render("adminRecipes/recipes-manager", { recipes, pagination, error, success })

    } catch (error) {
      console.log(error)
    }
  },
  async create(req, res) {
    try {
      const chefOptions = await Recipe.chefSelectOptions()
      return res.render('adminRecipes/recipe-create', { chefOptions })
      
    } catch (error) {
      console.error(error)
      req.session.error = `ATENÇÃO: ${error}`
      return res.redirect('/admin/recipes')
    }
  },
  async post(req, res) {
    try {    
      treatFieldInformation(req.body)
      const reqBody = {
        ...req.body,
        ingredients: `{${req.body.ingredients.join(',')}}`,
        preparation: `{${req.body.preparation.join(',')}}`
      }

      const recipeId = await Recipe.create(reqBody)

      const filesPromise = req.files.map(file => {
        File.createRecipeFile({
          name: file.filename,
          path: file.path.replace(/\\/g, "/" ), 
        }, recipeId)
      })
  
      await Promise.all(filesPromise)

      req.session.success = 'Receita criada com sucesso!'
      return res.redirect(`/admin/recipes/${recipeId}`)

    } catch (err) {
      console.error(err)
      const error = `ATENÇÃO: ${err}`
      const chefOptions = await Recipe.chefSelectOptions()
      return res.render('adminRecipes/recipe-create', { chefOptions, error })
    }
  },
  async show(req, res) {
    try {
      const { recipe } = req
      const { error, success } = req.session
      req.session.error   = ''
      req.session.success = ''

      let results = await File.findRecipeFile(recipe.id)
      let files = results.rows
      files     = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
      }))

      return res.render('adminRecipes/recipe-detail', {
        recipe,
        files,
        error,
        success
      })

    } catch (error) {
      console.error(error)
      req.session.error = `ATENÇÃO: ${error}`
      return res.redirect('/admin/recipes')
    }
  },
  async edit(req, res) {
    try {
      const { recipe } = req
      const { error, success } = req.session
      req.session.error   = ''
      req.session.success = ''
      
      const chefOptions = await Recipe.chefSelectOptions()

      const results = await File.findRecipeFile(recipe.id)
      let files = results.rows
      files     = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
      }))

      return res.render('adminRecipes/recipe-edit', {
        recipe,
        chefOptions,
        files,
        error,
        success
      })

    } catch (error) {
      console.error(error)
      req.session.error = `ATENÇÃO: ${error}`
      return res.redirect('/admin/recipes')
    }
  },
  async put(req, res) {
    try {  
      treatFieldInformation(req.body)

      if (req.body.removed_files) {
        // 1,2,3,
        const removedFiles = req.body.removed_files.split(",") //[1,2,3, ]
        const lastIndex    = removedFiles.length - 1
        removedFiles.splice(lastIndex, 1) // [1,2,3]
  
        const removedFilesPromise = removedFiles.map(fileId => File.deleteFile(fileId, 'recipe'))
        await Promise.all(removedFilesPromise)
      }
  
      if (req.files.length != 0) {
        const filesPromise = req.files.map(file => {
          File.createRecipeFile({
            name: file.filename,
            path: file.path.replace(/\\/g, "/" ), 
          }, req.body.id)
        })
    
        await Promise.all(filesPromise)
      }

      const { id, chef_id, title, ingredients, preparation, information } = req.body
  
      await Recipe.update(id, {
        chef_id, 
        title, 
        ingredients: `{${ingredients.join(',')}}`,
        preparation: `{${preparation.join(',')}}`,
        information
      })
  
      req.session.success = 'Receita atualizada com sucesso!'
      return res.redirect(`/admin/recipes/${req.body.id}`)

    } catch (error) {
      console.error(error)
      req.session.error = `ATENÇÃO: ${error}`
      return res.redirect(`/admin/recipes/${req.body.id}/edit`)
    }
  },
  async delete(req, res) {
    try {
      let results = await File.findRecipeFile(req.body.id)
      let files   = results.rows

      const filesPromise = files.map(file => File.deleteFile(file.id, 'recipe'))

      await Promise.all(filesPromise)

      await Recipe.delete(req.body.id)
      
      req.session.success = 'Receita deletada com sucesso!'
      return res.redirect(`/admin/recipes`)
      
    } catch (error) {
      console.error(error)
      req.session.error = `ATENÇÃO: ${error}`
      return res.redirect(`/admin/recipes`)
    }
  },
}