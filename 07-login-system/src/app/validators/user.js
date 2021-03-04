const User = require('../models/User');
const { compare } = require('bcryptjs')

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (key of keys) {
    if (body[key] == '') {
      return { 
        error: 'Por favor, preencha todos os campos!', 
        user: body 
      };
    }
  }
}

module.exports = {
  async post(req, res, next) {
    try {
      const fillAllFields = checkAllFields(req.body);
      if (fillAllFields) {
        return res.render('adminUsers/user-create', fillAllFields)
      }

      const { email } = req.body;

      const user = await User.findOne({ where: { email }})

      if (user) {
        const error = 'Usuário já cadastrado!';
        return res.render('adminUsers/user-create', { error, user: req.body });
      }

      next();
    } catch (error) {
      console.error(error);
    }
  },
  async put(req, res, next) {
    try {
      const fillAllFields = checkAllFields(req.body)
      if (fillAllFields) {
        return res.render('adminUsers/user-edit', fillAllFields)
      }

      const { id } = req.body
      const user = await User.findOne({ where: { id } })

      if (!user) {
        return res.render('adminUsers/user-edit', {
          user: req.body,
          error: 'Usuário não encontrado!',
        });
      }

      next()
    } catch (error) {
      console.error(error)
    }
  },
  async delete(req, res, next) {
    try {
      const { userId } = req.session 
      const { id: idDeleted } = req.body

      const userInSession = await User.findOne({ where: { id: userId } })
      
      if (idDeleted == userInSession.id) {
        req.session.error = "Não é possível deletar seu próprio perfil."
        return res.redirect('/admin/users')
      }
      if (!userInSession.is_admin) {
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
      const { userId: id } = req.session 

      const user = await User.findOne({ where: { id } })
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

      const { id, password } = req.body

      if (!password) {
        const error = 'Coloque sua senha para atualizar seu cadastro!';
        return res.render('adminProfile/index', { error, user: req.body });
      }

      const user = await User.findOne({ where: {id} })

      const passed = await compare(password, user.password)

      if (!passed) {
        const error = 'Senha incorreta!';
        return res.render('adminProfile/index', { error, user: req.body });
      }

      next()
    } catch (error) {
      console.error(error)
    }
  },
  async onlyAdm(req, res, next) {
    try {
      const { userId: id } = req.session
    
      const user = await User.findOne({ where: { id } })
      if(!user.is_admin) {
        return res.redirect('/admin/profile');
      }

      next()
    } catch (error) {
      console.error(error)
    }
  }
}