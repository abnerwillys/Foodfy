const User = require("../models/User")

module.exports = {
  async index(req, res) {
    try {
      const { user } = req
      const { error, success } = req.session
      req.session.error   = ''
      req.session.success = ''

      return res.render("adminProfile/index", { user, success, error })
    } catch (error) {
      console.error(error)
    }
  },
  async put(req, res) {
    try {
      const { id, name, email } = req.body

      const error = await User.update(id, {
        name,
        email,
      })

      if (error) {
        req.session.error = `ATENÇÃO: ${error}`
        return res.redirect('/admin/profile')
      }

      req.session.success = 'Perfil atualizado com sucesso!'

      return res.redirect('/admin/profile')
    } catch (error) {
      console.error(error)

      return res.render('adminProfile/index', {
        error: 'Algum erro aconteceu!',
        user: req.body
      })
    }
  },
}