const Recipe = require('../models/Recipe')
const File   = require('../models/File')
const { treatFilesFromData } = require('../../lib/useful')

function formatSrcFile(file, req) {
  return `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
}

const LoadService = {
  load(service, data) {
    this.data = data
    return this[service]()
  },
  async recipe() {
    try {
      const recipe = await Recipe.findRecipe(this.data.id)
      let results  = await File.findRecipeFile(recipe.id)
      let files = results.rows
      files     = files.map(file => ({
        ...file,
        src: this.formatSrcFile(file, this.data.req)
      }))

      return { recipe, files }
    } catch (error) {
      console.error(error)
    }
  },
  async recipes() {
    try {
      const { params, userIdForPaginate, req } = this.data
      let recipes = await Recipe.paginated(params, userIdForPaginate)
      
      const recipesPromises = recipes.map(recipe => File.findRecipeFile(recipe.id))
      const results = await Promise.all(recipesPromises)

      recipes = treatFilesFromData('recipe', recipes, results, req)

      return recipes
    } catch (error) {
      console.error(error)
    }
  },
  formatSrcFile,
}

module.exports = LoadService