const db   = require('../../config/db')
const Base = require('./Base')

Base.init({ table: 'chefs' })

module.exports = {
  ...Base,
  async findChef(id) {
    try {
      const query = `
        SELECT chefs.*, count(recipes) AS number_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1
        GROUP BY chefs.id
      `
      const results = await db.query(query, [id])
      return results.rows[0]

    } catch (error) {
      console.error(error)
    }
  },
  async findAllGroupBy(groupBy) {
    try {
      const query = `
        SELECT chefs.*, count(recipes) AS number_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.${groupBy}
        ORDER BY chefs.name
      `
      const results = await db.query(query)
      return results.rows

    } catch (error) {
      console.error(error)
    }
  },
  async findRecipesFromChef(id, orderBy = 'title') {
    try {
      const query = `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE recipes.chef_id = $1
        ORDER BY recipes.${orderBy} ASC
      `

      const results = await db.query(query, [id])
      return results.rows

    } catch (error) {
      console.error(error)
    }
  },
  fileChef(id) {
    try {
      const query = `
        SELECT * 
        FROM files
        WHERE id = $1
      `

      return db.query(query, [id])
    } catch (error) {
      console.error(error)
    }
  }
}