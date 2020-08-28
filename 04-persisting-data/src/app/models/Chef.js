const db = require('../../config/db')
const { date } = require('../../lib/useful')

module.exports = {
  all(callback) {
    const query = `
      SELECT *
      FROM chefs
      ORDER BY name ASC
    `

    db.query(query, (err, results) => {
      if(err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  },
  create(data, callback) {
    const query = `
      INSERT INTO chefs (
        name,
        avatar_url,
        created_at
      ) VALUES ($1, $2, $3)
      RETURNING id
    `

    const values = [
      data.name,
      data.avatar_url,
      date(Date.now()).iso
    ]

    db.query(query, values, (err, results) => {
      if(err) throw `Database Error! ${err}`

      callback(results.rows[0])
    })
  },
  find(id, callback) {
    const query = `
      SELECT chefs.*, count(recipes) AS number_recipes
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      WHERE chefs.id = $1
      GROUP BY chefs.id
    `
    db.query(query, [id], (err, results) => {
      if(err) throw `Database Error! ${err}`

      callback(results.rows[0])
    })
  },
  findRecipes(id, callback) {
    const query = `
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
      WHERE recipes.chef_id = $1
      ORDER BY recipes.title ASC
    `

    db.query(query, [id], (err, results) => {
      if(err) throw `Database Error! ${err}`
  
      callback(results.rows)
    })
  },
  update(data, callback) {
    const query = `
      UPDATE chefs SET
        name=($1),
        avatar_url=($2)
      WHERE id = $3
    `

    const values = [
      data.name,
      data.avatar_url,
      data.id
    ]

    db.query(query, values, (err, results) => {
      if(err) throw `Database Error! ${err}`

      callback()
    })
  },
  delete(id, callback) {
    const query = `
      DELETE FROM chefs
      WHERE id = $1
    `

    db.query(query, [id], (err, results) => {
      if(err) throw `Database Error! ${err}`

      callback()
    })
  },
}