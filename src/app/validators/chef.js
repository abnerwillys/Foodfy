const LoadChefService = require('../services/LoadChefService')

function checkAllFields(body) {
  const keys = Object.keys(body)

  for (key of keys) {
    if (body[key] == '' && key != 'removed_file') {
      return {
        error: 'Por favor, todos os campos devem ser preenchidos!',
        user: body,
      }
    }
  }
}

module.exports = {
  post(req, res, next) {
    try {
      const fillAllFields = checkAllFields(req.body)
      if (fillAllFields) {
        return res.render('adminChefs/chef-create', fillAllFields)
      }

      if (!req.file) {
        const error = 'Por favor, é obrigatório o envio de uma imagem de perfil.'
        return res.render('adminChefs/chef-create', {
          error,
          chef: req.body,
        })
      }

      next()
    } catch (error) {
      console.error(error)
    }
  },
  async show(req, res, next) {
    try {
      const { chef, file, recipes } = await LoadChefService.load('chef', { id: req.params.id , req})
      if (!chef) {
        req.session.error = 'Chef não encontrado!'
        return res.redirect('/admin/chefs')
      }

      req.chef = chef
      req.file = file
      req.recipes = recipes

      next()
    } catch (error) {
      console.error(error)
    }
  },
  async edit(req, res, next) {
    try {
      const { chef, file } = await LoadChefService.load('chef', { id: req.params.id , req})
      if (!chef) {
        req.session.error = 'Chef não encontrado!'
        return res.redirect('/admin/chefs')
      }

      req.chef = chef
      req.file = file

      next()
    } catch (error) {
      console.error(error)
    }
  },
  put(req, res, next) {
    try {
      const fillAllFields = checkAllFields(req.body)
      if (fillAllFields) {
        return res.render('adminChefs/chef-edit', fillAllFields)
      }

      next()
    } catch (error) {
      console.error(error)
    }
  },
}
