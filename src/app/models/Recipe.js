const db   = require('../../config/db')
const Base = require('./Base')

Base.init({ table: 'recipes' })

module.exports = {
  ...Base,
  async getAll() {
    try {
      const query = `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        ORDER BY recipes.title ASC
      `

      const results = await db.query(query)
      return results.rows

    } catch (error) {
      console.error(error)
    }
  },
  async findRecipe(id) {
    try {
      const query = `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
      `

      const results = await db.query(query, [id])
      return results.rows[0]
      
    } catch (error) {
      console.error(error)
    }
  },
  async chefSelectOptions() {
    try {
      const query = `
        SELECT id, name 
        FROM chefs
        ORDER BY name ASC
      `

      const results = await db.query(query)
      return results.rows

    } catch (error) {
      console.error(error)
    }
  },
  async paginated(params, userId) {
    try {
      const { filter, limit, offset, orderBy, isDesc } = params

      let query = "", 
          userIdQuery = ""
          filterQuery = "",
          subQuery = `(
            SELECT count(*) 
            FROM recipes
            ${userId ? `WHERE recipes.user_id = ${userId}` : ''}
          ) AS total`

      if (filter) {
        filterQuery = `
          WHERE recipes.title ILIKE '%${filter}%'
        `

        subQuery = `(
          SELECT count(*) 
          FROM recipes
          ${filterQuery}
        ) AS total`
      }

      if (userId) {
        userIdQuery = `WHERE recipes.user_id = ${userId}`
      }
      
      query = `
        SELECT recipes.*, ${subQuery}, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ${filterQuery}
        ${userIdQuery}
        ORDER BY recipes.${orderBy ? orderBy : 'title'} ${isDesc ? 'DESC' : 'ASC'}
        ${limit && offset ? `LIMIT ${limit} OFFSET ${offset}` : ''}
      `

      const results = await db.query(query)
      return results.rows

    } catch (error) {
      console.error(error)
    }
  },
}