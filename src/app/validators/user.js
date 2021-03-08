const { compare } = require('bcryptjs')
const LoadUserService = require('../services/LoadUserService')

function checkAllFields(body) {
  const keys = Object.keys(body)

  for (key of keys) {
    if (body[key] == '' && key != 'password') {
      return { 
        error: 'Por favor, preencha todos os campos!', 
        user: body 
      }
    }
  }
}

module.exports = {
  async post(req, res, next) {
    try {
      const fillAllFields = checkAllFields(req.body)
      if (fillAllFields) {
        return res.render('adminUsers/user-create', fillAllFields)
      }

      const user = await LoadUserService.load('user', {
        where: { email: req.body.email }
      })

      if (user) {
        const error = 'Usuário já cadastrado!'
        return res.render('adminUsers/user-create', { error, user: req.body })
      }

      next()
    } catch (error) {
      console.error(error)
    }
  },
  async put(req, res, next) {
    try {
      const fillAllFields = checkAllFields(req.body)
      if (fillAllFields) {
        return res.render('adminUsers/user-edit', fillAllFields)
      }

      const user = await LoadUserService.load('user', {
        where: { id: req.body.id }
      })

      if (!user) {
        return res.render('adminUsers/user-edit', {
          user: req.body,
          error: 'Usuário não encontrado!',
        })
      }

      next()
    } catch (error) {
      console.error(error)
    }
  },
  async delete(req, res, next) {
    try {
      const { user: userInSession } = req.session 
      const { id: idDeleted } = req.body

      if (idDeleted == userInSession.id) {
        req.session.error = "Não é possível deletar seu próprio perfil."
        return res.redirect('/admin/users')
      }
      if (!userInSession.isAdmin) {
        req.session.error = "Usuário em sessão não tem permissão para deletar outros usuários!"
        return res.redirect('/admin/users')
      }
      
      next()
    } catch (error) {
      console.error(error)
      req.session.error = "Algum erro aconteceu!"
      return res.redirect('/admin/users')
    }
  },
  async indexProfile(req, res, next) {
    try {
      const { user: userInSession } = req.session 
      
      const user = await LoadUserService.load('user', {
        where: { id: userInSession.id }
      })
      if (!user) 
        return res.render('adminProfile/index', {
          error: "Usuário não encontrado!"
        })

      req.user = user

      next()
    } catch (error) {
      console.error(error)
    }
  },
  async putProfile(req, res, next) {
    try {
      const fillAllFields = checkAllFields(req.body)
      if (fillAllFields) {
        return res.render('adminProfile/index', fillAllFields)
      }

      const { id, email, password } = req.body
      const { user: userInSession } = req.session

      if (!password) {
        const error = 'Coloque sua senha para atualizar seu cadastro!'
        return res.render('adminProfile/index', { error, user: req.body })
      }

      const userAlreadyExists = await LoadUserService.load('user', { where: { email }})
      if (userAlreadyExists && userAlreadyExists.id != userInSession.id) {
        const error = 'Já existe um usuário com este email!'
        return res.render('adminProfile/index', { error, user: req.body })
      }

      const user = await LoadUserService.load('user', { where: { id }})

      const passed = await compare(password, user.password)
      if (!passed) {
        const error = 'Senha incorreta!'
        return res.render('adminProfile/index', { error, user: req.body })
      }

      next()
    } catch (error) {
      console.error(error)
    }
  },
}