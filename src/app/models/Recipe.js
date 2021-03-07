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
  async paginated(params) {
    try {
      const { filter, limit, offset, orderBy, isDesc } = params

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
        ORDER BY recipes.${orderBy ? orderBy : 'title'} ${isDesc ? 'DESC' : 'ASC'}
        LIMIT $1 OFFSET $2
      `

      const results = await db.query(query, [limit, offset])
      return results.rows

    } catch (error) {
      console.error(error)
    }
  },
}

/* 
async createRec(data) {
  const query = `
    INSERT INTO recipes (
      chef_id,
      title,
      ingredients,
      preparation,
      information
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `

  const values = [
    data.chef_id,
    data.title,
    data.ingredients,
    data.preparation,
    data.information,
  ]

  const results = await db.query(query, values)
  return results.rows[0].id;
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
*/