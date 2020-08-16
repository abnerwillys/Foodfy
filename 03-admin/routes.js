const express = require('express')
const routes  = express.Router()

const { notFoundData } = require('./controllers/page404')
const clientArea = require('./controllers/clientArea')
const adminArea  = require('./controllers/adminArea')

//Routes
routes
.get('/', clientArea.index)
.get('/about', clientArea.about)
.get('/recipes', clientArea.recipes)
.get('/recipes/:index', clientArea.recipeDetail)

.get("/admin/recipes", adminArea.index) // Mostrar a lista de receitas
.get("/admin/recipes/create", adminArea.create) // Mostrar formulário de nova receita
.get("/admin/recipes/:id", adminArea.show) // Exibir detalhes de uma receita
.get("/admin/recipes/:id/edit", adminArea.edit) // Mostrar formulário de edição de receita

.post("/admin/recipes", adminArea.post) // Cadastrar nova receita
.put("/admin/recipes", adminArea.put) // Editar uma receita
.delete("/admin/recipes", adminArea.delete) // Deletar uma receita


.use((req, res) => {
  res.status(404).render('not-found', { notFoundData })
})

module.exports = routes
