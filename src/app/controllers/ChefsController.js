const Chef = require('../models/Chef')
const File = require('../models/File')
const LoadChefService = require('../services/LoadChefService')

module.exports = {
  async index(req, res) {
    try {
      const { error, success } = req.session
      req.session.error   = ''
      req.session.success = ''
      
      const chefs = (await LoadChefService.load('chefs', { req }))
        .sort((a,b) => a.name.localeCompare(b.name))

      if (chefs == "") {
        const message = "Nenhum chef cadastrado!"
        return res.render('adminChefs/chefs-manager', { message, error, success })
      }

      return res.render('adminChefs/chefs-manager', { chefs, error, success })
    } catch (error) {
      console.error(error)
    }
  },
  create(req, res) {
    return res.render('adminChefs/chef-create')
  },
  async post(req, res) {
    try {
      const { filename, path } = req.file
      const file_id = await File.create({
        name: filename,
        path: path.replace(/\\/g, "/" ),
      })

      const chefId = await Chef.create({ ...req.body, file_id })

      req.session.success = 'Chef criado com sucesso!'
      return res.redirect(`/admin/chefs/${chefId}`)

    } catch (error) {
      console.error(error)
      return res.render('adminChefs/chef-create', {
        error: `ATENÇÃO: ${error}`,
        chef: req.body,
      })
    }
  },
  async show(req, res) {
    try {
      const { chef, file, recipes } = req
      const { error, success } = req.session
      req.session.error   = ''
      req.session.success = ''

      if (recipes == "") {
        const message = "Nenhuma receita cadastrada!"
        return res.render('adminChefs/chef-detail', { chef, file, message, error, success })
      }

      return res.render('adminChefs/chef-detail', { chef, file, recipes, error, success })

    } catch (error) {
      console.error(error)
      req.session.error = `ATENÇÃO: ${error}`
      return res.redirect(`/admin/chefs`)
    }
  },
  async edit(req, res) {
    try {
      const { chef, file } = req
      const { error, success } = req.session
      req.session.error   = ''
      req.session.success = ''

      return res.render('adminChefs/chef-edit', { chef, file, error, success })

    } catch (error) {
      console.error(error)
      req.session.error = `ATENÇÃO: ${error}`
      return res.redirect(`/admin/chefs`)
    }
  },
  async put(req, res) {
    try {      
      if (req.body.removed_file) {
        const { id, name, removed_file } = req.body
        const { filename, path } = req.file
        
        const file_id = await File.create({
          name: filename,
          path: path.replace(/\\/g, "/" ),
        })

        await Chef.update(id, { name, file_id })
        await File.deleteFile(removed_file)
        
      } else {
        const { id, name, current_file } = req.body

        await Chef.update(id, { name, file_id: current_file })
      } 

      req.session.success = 'Chef atualizado com sucesso!'
      return res.redirect(`/admin/chefs/${req.body.id}`)

    } catch (error) {
      console.error(error)
      req.session.error = `ATENÇÃO: ${error}`
      return res.redirect(`/admin/chefs/${req.body.id}/edit`)
    }
  },
  async delete(req, res) {
    try {
      await Chef.delete(req.body.id)
    
      await File.deleteFile(req.body.current_file)

      req.session.success = 'Chef deletado com sucesso!'
      return res.redirect(`/admin/chefs`)

    } catch (error) {
      console.error(error)
      req.session.error = `ATENÇÃO: ${error}`
      return res.redirect(`/admin/chefs`)
    }
  }
}