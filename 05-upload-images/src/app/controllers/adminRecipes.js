const Recipe     = require('../models/Recipe')
const RecipeFile = require('../models/RecipeFile')
const File       = require('../models/File')

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

      const pagination = {
        totalPages: Math.ceil(recipes[0].total / limit),
        page
      }

      return res.render("adminArea/recipes-manager", { recipes, pagination, filter })

    } catch (error) {
      const message = "Nenhuma receita encontrada!"

      if (error) {
        console.log(error)
        return res.render("adminArea/recipes-manager", { message })
      }
    }
  },
  async create(req, res) {
    let results = await Recipe.chefSelectOptions()
    const chefOptions = results.rows
    
    return res.render('adminArea/recipes-create', { chefOptions })
  }, //ok
  async post(req, res) {
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
      File.create({
        filename: file.filename,
        path: file.path.replace(/\\/g, "/" )
      })
    })
    await Promise.all(filesPromise)

    return res.redirect(`/admin/recipes/${recipeId}`)
  }, //ok
  async show(req, res) {
    let results  = await Recipe.find(req.params.id)
    const recipe = results.rows[0]

    if(!recipe) return res.send('Recipe not found!')

    return res.render('adminArea/recipes-show', { recipe })
  },
  async edit(req, res) {
    let results  = await Recipe.find(req.params.id)
    const recipe = results.rows[0]
    
    if(!recipe) return res.send('Recipe not found!')
    
    results = Recipe.chefSelectOptions()
    const chefOptions = results.rows

    return res.render('adminArea/recipes-edit', { recipe, chefOptions })
  },
  async put(req, res) {
    if (req.body.information == "" || !req.body.information) {
      req.body.information = 'Sem informações adicionais.'
    }

    const keys = Object.keys(req.body)
    for(key of keys) {
      if(req.body[key] == "") return res.send('Please, fill all fields!')
    }
  
    await Recipe.update(req.body)

    return res.redirect(`/admin/recipes/${req.body.id}`)
  },
  async delete(req, res) {
    await Recipe.delete(req.body.id)
    
    return res.redirect(`/admin/recipes`)
  },
}