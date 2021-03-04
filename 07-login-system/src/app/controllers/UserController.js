const crypto = require('crypto');
const User = require('../models/User');
const mailer   = require('../../lib/mailer')

module.exports = {
  async list(req, res) {
    const { error, success } = req.session;
    req.session.error   = '';
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
      const token = crypto.randomBytes(20).toString('hex')

      let now = new Date()
      now = now.setDate(now.getDate() + 1)

      const password = crypto.randomBytes(5).toString('hex');
      const newUser = {
        ...req.body,
        password,
        reset_token: token,
        reset_token_expires: now,
      };

      await User.create(newUser);

      await mailer.sendMail({
        from: 'no-reply@foodfy.com.br',
        to: newUser.email,
        subject: 'Bem vindo ao Foodfy',
        html: `
          <h2>Olá ${newUser.name}. Bem vindo ao Foodfy!</h2>
          <p>É um prazer enorme ter você trabalhando conosco.   🤗🎉🥳</p>
          <br/>
          <p>Segue abaixo seus dados de usuário:</p>
          <p>Login: <strong>${newUser.email}</strong></p>
          <p>Senha: <strong>${newUser.password}</strong></p>
          <br/>
          <p>Pra começar com pé direito vamos melhorar a segurança mudando sua senha. 😀</p>
          <p>
            <a href="http://localhost:3000/session/reset-password?token=${token}" target="_blank">
              Link para mudança de senha
            </a>
          </p>
          <p><strong>IMPORTANTE:</strong> Este Link é válido por 1 dia.</p>
          <br/>
          <p>Abraços - Equipe Foodfy 😘</p>
        `,
      })

      req.session.success = 'Usuário cadastrado com sucesso!';

      return res.redirect('/admin/users');
    } catch (error) {
      console.error(error);

      return res.render('adminUsers/user-create', {
        error: 'Algum erro aconteceu. Caso o erro persista contate o suporte!',
      });
    }
  },
  async edit(req, res) {
    const { id } = req.params;
    const { error, success } = req.session
    req.session.error   = ''
    req.session.success = ''

    const user = await User.findOne({ where: { id }})

    return res.render('adminUsers/user-edit', { user, success, error });
  },
  async put(req, res) {
    try {
      const { id } = req.body

      const error = await User.update(id, req.body)
      if (error) {
        req.session.error = `ATENÇÃO: ${error}`
        return res.redirect(`/admin/users/${id}/edit`)
      }

      req.session.success = 'Usuário atualizado com sucesso!'
      return res.redirect('/admin/users')

    } catch (error) {
      console.error(error)
      return res.render('adminUsers/user-edit', {
        error: 'Algum erro aconteceu!',
        user: req.body
      })
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
      req.session.error = "Algum erro aconteceu!"
      return res.redirect('/admin/users')
    }
  },
};
