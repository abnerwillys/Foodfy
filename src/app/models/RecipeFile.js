const db = require('../../config/db')

module.exports = {
  create(recipeId, fileId) {
    const query = `
      INSERT INTO recipe_files (
        recipe_id,
        file_id
      ) VALUES ($1, $2)
      RETURNING id
    `

    const values = [
      recipeId,
      fileId
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
  }
}