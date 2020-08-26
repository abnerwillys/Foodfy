const fs = require('fs')
const data = require('../data.json')
const { notFoundData } = require('./page404')

exports.index = (request, response) => {
  return response.render('adminArea/recipes-manager', { items: data.recipes })
}

exports.create = (request, response) => {
  return response.render('adminArea/recipes-create')
}

exports.show = (request, response) => {
  const recipeId = request.params.id

  if (!data.recipes[recipeId]) {
    return response.render('not-found', { notFoundData })
  }

  const chosenRecipe = {
    ...data.recipes[recipeId],
    id: recipeId,
  }

  return response.render('adminArea/recipes-show', { item: chosenRecipe })
}

exports.edit = (request, response) => {
  const recipeId = request.params.id

  if (!data.recipes[recipeId]) {
    return response.render('not-found', { notFoundData })
  }

  const chosenRecipe = {
    ...data.recipes[recipeId],
    id: recipeId,
  }

  return response.render('adminArea/recipes-edit', { item: chosenRecipe })
}

exports.post = (request, response) => {
  
  let { image, title, author, ingredients, preparation, information } = request.body

  if (information == "" || !information) {
    information = 'Sem informações adicionais.'
  }

  data.recipes.push({
    image,
    title,
    author,
    ingredients,
    preparation,
    information
  })
  
  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if(err) return response.send('Write file error!')

    return response.redirect('/admin/recipes')
  })
}

exports.put = (request, response) => {
  let { id, image, title, author, ingredients, preparation, information } = request.body

  if (information == "" || !information) {
    information = 'Sem informações adicionais.'
  }

  data.recipes[id] = {
    image,
    title,
    author,
    ingredients,
    preparation,
    information
  }

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if(err) return response.send('Write file error!')

    return response.redirect(`/admin/recipes/${id}`)
  })  
}

exports.delete = (request, response) => {
  const recipeId = request.body.id

  const filteredRecipes = data.recipes.filter(recipe => {
    return recipe != data.recipes[recipeId]
  })

  data.recipes = filteredRecipes

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if(err) return response.send('Error in delete recipe!')

    return response.redirect('/admin/recipes')
  })
}