const Chef = require('../models/Chef')

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
      const chef = await Chef.findChef(req.params.id)
      if (!chef) {
        req.session.error = 'Chef não encontrado!'
        return res.redirect('/admin/chefs')
      }

      req.chef = chef

      next()
    } catch (error) {
      console.error(error)
    }
  },
  async edit(req, res, next) {
    try {
      const chef = await Chef.findChef(req.params.id)
      if (!chef) {
        req.session.error = 'Chef não encontrado!'
        return res.redirect('/admin/chefs')
      }

      req.chef = chef

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
