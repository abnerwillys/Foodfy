const crypto = require('crypto');

const User = require('../models/User');

module.exports = {
  async list(req, res) {
    const { error, success } = req.session;
    req.session.error = '';
    req.session.success = '';

    const users = await User.findAll();

    if (users == "") {
      const message = "Nenhum usuário cadastrado!"
      return res.render('adminUsers/users-manager', { message, success, error });
    }

    return res.render('adminUsers/users-manager', { users, success, error });
  },
  create(req, res) {
    return res.render('adminUsers/user-create');
  },
  async post(req, res) {
    try {
      const token = crypto.randomBytes(20).toString('hex');

      let now = new Date();
      now = now.setHours(now.getHours() + 1);

      req.body = {
        ...req.body,
        reset_token: token,
        reset_token_expires: now,
      };

      const userId = await User.create(req.body);

      req.session.userId  = userId;
      req.session.success = 'Usuário cadastrado com sucesso!';

      return res.redirect('/admin/users');
    } catch (error) {
      console.error(error);

      return res.render('adminUsers/user-create', {
        error: 'Algum erro aconteceu. Caso o erro persista contate o suporte!',
      });
    }
  },
  edit(req, res) {
    return res.render('adminUsers/user-edit');
  },
  put(req, res) {},
  delete(req, res) {},
};
