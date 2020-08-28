const db = require('../../config/db')
const { date } = require('../../lib/useful')

module.exports = {
  all(resource, callback) {
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

    db.query(query, (err, results) => {
      if(err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  },
  find(resource, id, callback) {
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
  findBy(filter, callback) {
    const query = `
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.title ILIKE '%${filter}%'
      ORDER BY title ASC
    `

    db.query(query, (err, results) => {
      if(err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  },
  paginate() {}
}