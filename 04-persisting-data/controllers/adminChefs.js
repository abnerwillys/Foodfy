const fs = require('fs')
const data = require('../data.json')
const { notFoundData } = require('./page404')

module.exports = {
  index(request, response) {
    return response.render('adminArea/chefs-manager', { items: data.recipes })
  },
  create(request, response) {
    return response.render('adminArea/chefs-create')
  },
  show(request, response) {
    const recipeId = request.params.id
  
    if (!data.recipes[recipeId]) {
      return response.render('not-found', { notFoundData })
    }
  
    const chosenRecipe = {
      ...data.recipes[recipeId],
      id: recipeId,
    }
  
    return response.render('adminArea/chefs-show', { items: data.recipes, chosenRecipe })
  },
  redirect(request, response) {
    const recipeId = request.params.index
  
    return response.redirect(`/admin/recipes/${recipeId}`)
  },
  edit(request, response) {
    const recipeId = request.params.id
  
    if (!data.recipes[recipeId]) {
      return response.render('not-found', { notFoundData })
    }
  
    const chosenRecipe = {
      ...data.recipes[recipeId],
      id: recipeId,
    }
  
    return response.render('adminArea/chefs-edit', { item: chosenRecipe })
  },
  post(request, response) {
  
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
  },
  put(request, response) {
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
  },
  delete(request, response) {
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
}