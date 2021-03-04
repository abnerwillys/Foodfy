const db = require('../../config/db')
const { date } = require('../../lib/useful')

module.exports = {
  all(resource) {
    let query = `
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
      ORDER BY recipes.title ASC
    `

    if(resource == "chefs") {
      query = `
        SELECT chefs.*, count(recipes) AS number_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id
        ORDER BY chefs.name
      `
    }

    return db.query(query)
  },
  find(resource, id) {
    let query = `
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1
    `

    if(resource == "chefs") {
      query = `
        SELECT chefs.*, count(recipes) AS number_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1
        GROUP BY chefs.id
      `
    }

    return db.query(query, [id])
  },
  findRecipes(id) {
    const query = `
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
      WHERE recipes.chef_id = $1
      ORDER BY recipes.created_at DESC
    `

    return db.query(query, [id])
  },
  findBy(filter) {
    const query = `
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.title ILIKE '%${filter}%'
      ORDER BY title ASC
    `

    return db.query(query)
  },
  paginate(params) {
    const { filter, limit, offset, order } = params

    let query = "", 
        filterQuery = "",
        subQuery = `(
          SELECT count(*) 
          FROM recipes
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
    
    query = `
      SELECT recipes.*, ${subQuery}, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ${filterQuery}
      ORDER BY recipes.${order} DESC
      LIMIT $1 OFFSET $2
    `

    return db.query(query, [limit, offset])
  },
  chefFiles(id) {
    const query = `
      SELECT * 
      FROM files
      WHERE id = $1
    `

    return db.query(query, [id])
  }
}