const Chef = require('../models/Chef')
const File = require('../models/File')
const { treatFilesFromData } = require('../../lib/useful')

function formatSrcFile(file, req) {
  return `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
}

const LoadService = {
  load(service, data) {
    this.data = data
    return this[service]()
  },
  async chef() {
    try {
      const chef = await Chef.findChef(this.data.id)
      const file = await File.findById(chef.file_id)
      file.src   = this.formatSrcFile(file, this.data.req)

      const orderBy = this.data.isClient === true ? 'created_at' : undefined

      let recipes = await Chef.findRecipesFromChef(chef.id, orderBy)
      const recipesPromises = recipes.map(recipe => File.findRecipeFile(recipe.id))
      const results = await Promise.all(recipesPromises)
      
      recipes = treatFilesFromData('recipe', recipes, results, this.data.req)

      return { chef, file, recipes }
    } catch (error) {
      console.error(error)
    }
  },
  async chefs() {
    try {
      let chefs = []

      if (this.data.isClient === true) {
        chefs = await Chef.findAllGroupBy('id')
      } else {
        chefs = await Chef.findAll()
      }

      const chefsPromises = chefs.map(chef => Chef.fileChef(chef.file_id))
      const results = await Promise.all(chefsPromises)

      chefs = treatFilesFromData('chef', chefs, results, this.data.req)

      return chefs
    } catch (error) {
      console.error(error)
    }
  },
  formatSrcFile,
}

module.exports = LoadService