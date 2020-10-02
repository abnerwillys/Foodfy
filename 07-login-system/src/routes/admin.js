const express = require('express')
const routes  = express.Router()

const multerChef   = require('../app/middlewares/multerChef')
const multerRecipe = require('../app/middlewares/multerRecipe')

const AdminRecipesController = require('../app/controllers/AdminRecipesController')
const AdminChefsController   = require('../app/controllers/AdminChefsController')


routes
.get("/recipes", AdminRecipesController.index)
.get("/recipes/create", AdminRecipesController.create)
.get("/recipes/:id", AdminRecipesController.show)
.get("/recipes/:id/edit", AdminRecipesController.edit)

.post("/recipes", multerRecipe.array("photos", 5), AdminRecipesController.post)
.put("/recipes", multerRecipe.array("photos", 5), AdminRecipesController.put)
.delete("/recipes", AdminRecipesController.delete)


.get("/chefs", AdminChefsController.index)
.get("/chefs/create", AdminChefsController.create)
.get("/chefs/:id", AdminChefsController.show)
.get("/chefs/:id/edit", AdminChefsController.edit)
.get("/chefs/:id/:index", AdminChefsController.redirect)

.post("/chefs", multerChef.single("photo_chef"), AdminChefsController.post)
.put("/chefs", multerChef.single("photo_chef"), AdminChefsController.put)
.delete("/chefs", AdminChefsController.delete)

module.exports = routes