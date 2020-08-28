const Chef = require('../models/Chef')

module.exports = {
  index(req, res) {
    Chef.all((chefs) => {
      return res.render('adminArea/chefs-manager', { chefs })
    })
  },
  create(req, res) {
    return res.render('adminArea/chefs-create')
  },
  show(req, res) {
    Chef.find(req.params.id, (chef) => {
      if(!chef) return res.send('Chef not found!')

      Chef.findRecipes(chef.id, (recipes) => {
        return res.render('adminArea/chefs-show', { chef, recipes })
      })      
    })  
  },
  post(req, res) {
    const keys = Object.keys(req.body)

    for(key of keys) {
      if(req.body[key] == "") return res.send('Please, fill all fields!')
    }
  
    Chef.create(req.body, (chef) => {
      return res.redirect(`/admin/chefs/${chef.id}`)
    })
  },
  redirect(req, res) {
    const recipeId = req.params.index
  
    return res.redirect(`/admin/recipes/${recipeId}`)
  },
  edit(req, res) {
    Chef.find(req.params.id, (chef) => {
      if(!chef) return res.send('Chef not found!')

      return res.render('adminArea/chefs-edit', { chef })
    })
  },
  put(req, res) {
    const keys = Object.keys(req.body)

    for(key of keys) {
      if(req.body[key] == "") return res.send('Please, fill all fields!')
    }
  
    Chef.update(req.body, () => {
      return res.redirect(`/admin/chefs/${req.body.id}`)
    })
  },
  delete(req, res) {
    Chef.delete(req.body.id, () => {
      return res.redirect(`/admin/chefs`)
    })
  }
}