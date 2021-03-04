const db = require('../../config/db')
const { date } = require('../../lib/useful')

module.exports = {
  all() {
    const query = `
      SELECT *
      FROM chefs
      ORDER BY name ASC
    `

    return db.query(query)
  },
  create(data) {
    const query = `
      INSERT INTO chefs (
        name,
        created_at,
        file_id
      ) VALUES ($1, $2, $3)
      RETURNING id
    `

    const values = [
      data.name,
      date(Date.now()).iso,
      data.file_id
    ]

    return db.query(query, values)
  },
  find(id) {
    const query = `
      SELECT chefs.*, count(recipes) AS number_recipes
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      WHERE chefs.id = $1
      GROUP BY chefs.id
    `

    return db.query(query, [id])
  },
  findRecipes(id) {
    const query = `
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
      WHERE recipes.chef_id = $1
      ORDER BY recipes.title ASC
    `

    return db.query(query, [id])
  },
  update(data) {
    const query = `
      UPDATE chefs SET
        name=($1),
        file_id=($2)
      WHERE id = $3
    `

    const values = [
      data.name,
      data.file_id,
      data.id
    ]

    console.log(data)
    console.log(values)

    return db.query(query, values)
  },
  delete(id) {
    const query = `
      DELETE FROM chefs
      WHERE id = $1
    `

    return db.query(query, [id])
  },
  files(id) {
    const query = `
      SELECT * 
      FROM files
      WHERE id = $1
    `

    return db.query(query, [id])
  }
}