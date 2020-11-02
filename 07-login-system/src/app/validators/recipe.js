const Recipe = require('../models/Recipe');

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (key of keys) {
    if (body[key] == '' && key != 'removed_files') {
      return {
        error:
          'Por favor, com exceção do campo "informações", todos os demais devem ser preenchidos!',
        user: body,
      };
    }
  }
}

function treatFieldInformation(body) {
  if (body.information == '' || !body.information) {
    body.information = 'Sem informações adicionais.';
  }
}

module.exports = {
  post(req, res, next) {
    try {
      treatFieldInformation(req.body);

      const fillAllFields = checkAllFields(req.body);
      if (fillAllFields) {
        return res.render('adminRecipes/recipe-create', fillAllFields);
      }

      if (req.files.length == 0) {
        const error = 'Por favor, envie ao menos uma imagem!';
        return res.render('adminRecipes/recipe-create', {
          error,
          user: req.body,
        });
      }

      next();
    } catch (error) {
      console.error(error);
    }
  },
  async show(req, res, next) {
    try {
      let results  = await Recipe.find(req.params.id);
      const recipe = results.rows[0];

      if (!recipe) {
        req.session.error = 'Receita não encontrada!'

        return res.redirect('/admin/recipes');
      }

      req.recipe = recipe;

      next();
    } catch (error) {
      console.error(error);
    }
  },
  async edit(req, res, next) {
    try {
      let results  = await Recipe.find(req.params.id);
      const recipe = results.rows[0];

      if (!recipe) {
        req.session.error = 'Receita não encontrada!'

        return res.redirect('/admin/recipes');
      }

      req.recipe = recipe;

      next();
    } catch (error) {
      console.error(error);
    }
  },
  put(req, res, next) {
    try {
      treatFieldInformation(req.body);

      const fillAllFields = checkAllFields(req.body);
      if (fillAllFields) {
        return res.render('adminRecipes/recipe-edit', fillAllFields);
      }

      next();
    } catch (error) {
      console.error(error);
    }
  },
};
