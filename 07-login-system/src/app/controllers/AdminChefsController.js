const Chef = require('../models/Chef')
const File = require('../models/File')

const { notFoundData } = require('../../lib/page404')

module.exports = {
  async index(req, res) {
    try {
      let results = await Chef.all()
      const chefs = results.rows

      if (chefs == "") {
        const message = "Nenhum chef cadastrado!"
        return res.render('adminArea/chefs-manager', { message })

      } else {
        const chefsPromises = chefs.map(chef => Chef.files(chef.file_id))

        results = await Promise.all(chefsPromises)
        
        for (let i = 0; i < chefs.length; i++) {
          let currentFile = results[i].rows[0]
          let fileTreated = {
            ...currentFile,
            src: `${req.protocol}://${req.headers.host}${currentFile.path.replace('public', "")}`
          }

          chefs[i] = {
            ...chefs[i], 
            file_chef: fileTreated
          }
        }
      }

      return res.render('adminArea/chefs-manager', { chefs })
    } catch (error) {
      console.error(error)
    }
  },
  create(req, res) {
    return res.render('adminArea/chef-create')
  },
  async post(req, res) {
    try {
      const keys = Object.keys(req.body)

      for(key of keys) {
        if(req.body[key] == "") return res.send('Please, fill all fields!')
      }

      let results   = await File.create(req.file)
      const file_id = results.rows[0].id    

      results      = await Chef.create({ ...req.body, file_id })
      const chefId = results.rows[0].id

      return res.redirect(`/admin/chefs/${chefId}`)

    } catch (error) {
      console.error(error)
    }
  },
  async show(req, res) {
    try {
      let results = await Chef.find(req.params.id)
      const chef  = results.rows[0]

      if(!chef) return res.render('not-found', { notFoundData })

      results    = await Chef.files(chef.file_id)
      const file = { 
        ...results.rows[0],
        src: `${req.protocol}://${req.headers.host}${results.rows[0].path.replace('public', "")}`
      }

      results = await Chef.findRecipes(chef.id)
      const recipes = results.rows

      if (recipes == "") {
        const message = "Nenhuma receita cadastrada!"
        return res.render('adminArea/chef-detail', { chef, file, message })
      
      } else {
        const recipesPromises = recipes.map(recipe => File.find(recipe.id))

        results = await Promise.all(recipesPromises)
        
        for (let i = 0; i < recipes.length; i++) {
          let currentFile = results[i].rows[0]
          let fileTreated = {
            ...currentFile,
            src: `${req.protocol}://${req.headers.host}${currentFile.path.replace('public', "")}`
          }

          recipes[i] = {
            ...recipes[i], 
            file_recipe: fileTreated
          }
        }
      }

      return res.render('adminArea/chef-detail', { chef, recipes, file })

    } catch (error) {
      console.error(error)
    }
  },
  redirect(req, res) {
    const recipeId = req.params.index
  
    return res.redirect(`/admin/recipes/${recipeId}`)
  },
  async edit(req, res) {
    try {
      let results = await Chef.find(req.params.id)
      const chef  = results.rows[0]

      if(!chef) return res.send('Chef not found!')

      results    = await Chef.files(chef.file_id)
      const file = { 
        ...results.rows[0],
        src: `${req.protocol}://${req.headers.host}${results.rows[0].path.replace('public', "")}`
      }

      return res.render('adminArea/chef-edit', { chef, file })

    } catch (error) {
      console.error(error)
    }
  },
  async put(req, res) {
    try {
      const keys = Object.keys(req.body)

      for(key of keys) {
        if(req.body[key] == "" && key != "removed_file") {
          return res.send('Please, fill all fields!')
        }
      }
      
      if (req.body.removed_file) {
        let results   = await File.create(req.file)
        const file_id = results.rows[0].id 

        await Chef.update({ ...req.body, file_id })

        await File.delete(req.body.removed_file)
        
      } else {
        const { id, name, current_file } = req.body

        await Chef.update({ id, name, file_id: current_file })
      } 

      return res.redirect(`/admin/chefs/${req.body.id}`)

    } catch (error) {
      console.error(error)
    }
  },
  async delete(req, res) {
    try {
      await Chef.delete(req.body.id)
    
      await File.delete(req.body.current_file)

      return res.redirect(`/admin/chefs`)

    } catch (error) {
      console.error(error)
    }
  }
}