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

.get("/admin/recipes", adminArea.index)
.get("/admin/recipes/create", adminArea.create)
.get("/admin/recipes/:id", adminArea.show)
.get("/admin/recipes/:id/edit", adminArea.edit)

.post("/admin/recipes", adminArea.post)
.put("/admin/recipes", adminArea.put)
.delete("/admin/recipes", adminArea.delete) 

.use((req, res) => {
  res.status(404).render('not-found', { notFoundData })
})

module.exports = routes
