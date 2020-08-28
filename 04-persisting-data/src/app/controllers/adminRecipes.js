const Recipe = require('../models/Recipe')

module.exports = {
  index(req, res) {
    Recipe.all((recipes) => {
      return res.render('adminArea/recipes-manager', { recipes })
    })
  },
  create(req, res) {
    Recipe.chefSelectOptions(options => {
      return res.render('adminArea/recipes-create', {chefOptions: options})
    })
  },
  show(req, res) {
    Recipe.find(req.params.id, (recipe) => {
      if(!recipe) return res.send('Recipe not found!')

      return res.render('adminArea/recipes-show', { recipe })
    })  
  },
  edit(req, res) {
    Recipe.find(req.params.id, (recipe) => {
      if(!recipe) return res.send('Recipe not found!')

      Recipe.chefSelectOptions(options => {
        return res.render('adminArea/recipes-edit', { recipe, chefOptions: options })
      })
    })
  },
  post(req, res) {
    if (req.body.information == "" || !req.body.information) {
      req.body.information = 'Sem informações adicionais.'
    }

    const keys = Object.keys(req.body)
    for(key of keys) {
      if(req.body[key] == "") return res.send('Please, fill all fields!')
    }
  
    Recipe.create(req.body, (recipe) => {
      return res.redirect(`/admin/recipes/${recipe.id}`)
    })
  },
  put(req, res) {
    if (req.body.information == "" || !req.body.information) {
      req.body.information = 'Sem informações adicionais.'
    }

    const keys = Object.keys(req.body)
    for(key of keys) {
      if(req.body[key] == "") return res.send('Please, fill all fields!')
    }
  
    Recipe.update(req.body, () => {
      return res.redirect(`/admin/recipes/${req.body.id}`)
    })
  },
  delete(req, res) {
    Recipe.delete(req.body.id, () => {
      return res.redirect(`/admin/recipes`)
    })
  },
}