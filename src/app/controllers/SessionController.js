const crypto   = require('crypto')
const { hash } = require('bcryptjs')
const User     = require('../models/User')
const { sendForgotEmail } = require('../services/SendMailService')

module.exports = {
  loginForm(req, res) {
    return res.render("session/login")
  },
  login(req, res) {
    req.session.user = {
      id: req.user.id,
      isAdmin: req.user.is_admin
    }

    return res.redirect('/admin/users')
  },
  logout(req, res) {
    req.session.destroy()

    return res.redirect('/')
  },
  forgotForm(req, res) {
    return res.render("session/forgot-password")
  },
  async forgot(req, res) {
    try {
      const user  = req.user
      const token = crypto.randomBytes(20).toString('hex')

      let now = new Date()
      now = now.setHours(now.getHours() + 1)

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now,
      })

      await sendForgotEmail(user, token)

      return res.render('session/forgot-password', {
        success:
          'Verifique seu email para prosseguir com a recuperação de senha!',
      })
    } catch (error) {
      console.error(error)

      return res.render('session/forgot-password', {
        user: req.body,
        error:
          'Erro inesperado, tente novamente. Se o erro persistir contate nosso suporte!',
      })
    }
  },
  resetForm(req, res) {
    return res.render("session/reset-password", { token: req.query.token })
  },
  async reset(req, res) {
    const user = req.user
    const { password, token } = req.body
    
    try {
      const newPassword = await hash(password, 8)

      await User.update(user.id, {
        password: newPassword,
        reset_token: '',
        reset_token_expires: '',
      })

      return res.render('session/login', {
        user: req.body,
        success: 'Senha atualizada! Faça seu login.',
      })

    } catch (error) {
      console.error(error)

      return res.render('session/reset-password', {
        token,
        user: req.body,
        error: 'Erro inesperado, tente novamente. Se o erro persistir contate nosso suporte!',
      })
    }
  },
}