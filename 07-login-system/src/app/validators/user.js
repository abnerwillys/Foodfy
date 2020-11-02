const User = require('../models/User');

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
  }
}