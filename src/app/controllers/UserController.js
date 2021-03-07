const crypto = require('crypto')
const User   = require('../models/User')
const { sendNewUserEmail }   = require('../services/SendMailService')

module.exports = {
  async list(req, res) {
    const { error, success } = req.session
    req.session.error   = ''
    req.session.success = ''

    const users = await (await User.findAll()).sort((a,b) => a.name.localeCompare(b.name))

    if (users == "") {
      const message = "Nenhum usuário cadastrado!"
      return res.render('adminUsers/users-manager', { message, success, error })
    }

    return res.render('adminUsers/users-manager', { users, success, error })
  },
  create(req, res) {
    return res.render('adminUsers/user-create')
  },
  async post(req, res) {
    try {
      const token = crypto.randomBytes(20).toString('hex')

      let now = new Date()
      now = now.setDate(now.getDate() + 1)

      const password = crypto.randomBytes(5).toString('hex')
      const newUser = {
        ...req.body,
        password,
        reset_token: token,
        reset_token_expires: now,
      }

      await User.create(newUser)
      await sendNewUserEmail(newUser, token)

      req.session.success = 'Usuário cadastrado com sucesso!'
      return res.redirect('/admin/users')

    } catch (error) {
      console.error(error)
      return res.render('adminUsers/user-create', {
        error: 'Algum erro aconteceu. Caso o erro persista contate o suporte!',
      })
    }
  },
  async edit(req, res) {
    const { id } = req.params
    const { error, success } = req.session
    req.session.error   = ''
    req.session.success = ''

    const user = await User.findOne({ where: { id }})

    return res.render('adminUsers/user-edit', { user, success, error })
  },
  async put(req, res) {
    try {
      const { id } = req.body

      await User.update(id, req.body)

      req.session.success = 'Usuário atualizado com sucesso!'
      return res.redirect('/admin/users')

    } catch (error) {
      console.error(error)
      req.session.error = `ATENÇÃO: ${error}`
      return res.redirect(`/admin/users/${req.body.id}/edit`)
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.body

      await User.delete(id)

      req.session.success = 'Usuário deletado com sucesso!'
      return res.redirect('/admin/users')

    } catch (error) {
      console.error(error)
      req.session.error = `ATENÇÃO: ${error}`
      return res.redirect('/admin/users')
    }
  },
}
