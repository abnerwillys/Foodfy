const db = require('../../config/db')
const { date } = require('../../lib/useful')

module.exports = {
  all() {
    const query = `
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
      ORDER BY recipes.title ASC
    `

    return db.query(query)
  },
  create(data) {
    const query = `
      INSERT INTO recipes (
        chef_id,
        title,
        ingredients,
        preparation,
        information,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `

    const values = [
      data.chef,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).iso
    ]

    return db.query(query, values)
  },
  find(id) {
    const query = `
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1
    `

    return db.query(query, [id])
  },
  update(data) {
    const query = `
      UPDATE recipes SET
        chef_id=($1),
        title=($2),
        ingredients=($3),
        preparation=($4),
        information=($5)
      WHERE id = $6
    `

    const values = [
      data.chef,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.id
    ]

    return db.query(query, values)
  },
  delete(id) {
    const query = `
      DELETE FROM recipes
      WHERE id = $1
    `

    return db.query(query, [id])
  },
  chefSelectOptions() {
    const query = `
      SELECT id, name 
      FROM chefs
      ORDER BY name ASC
    `

    return db.query(query)
  },
  paginate(params) {
    const { filter, limit, offset } = params

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
      ORDER BY recipes.title ASC
      LIMIT $1 OFFSET $2
    `

    return db.query(query, [limit, offset])
  }
}