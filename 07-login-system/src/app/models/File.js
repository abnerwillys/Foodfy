const db = require('../../config/db')
const fs = require('fs')

module.exports = {
  create({ filename, path }) {
    const query = `
      INSERT INTO files (
        name,
        path
      ) VALUES ($1, $2)
      RETURNING id
    `

    const values = [
      filename,
      path.replace(/\\/g, "/" ),
    ]

    return db.query(query, values)
  },
  async delete(id) {
    try {
      const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
      const file   = result.rows[0]

      fs.unlinkSync(file.path)

      return db.query(`DELETE FROM files WHERE id = $1`, [id])

    } catch (error) {
      console.error(error)
    }
  },
  async createRecipeFile({ filename, path, recipeId }) {
    try {
      let query = `
        INSERT INTO files (
          name,
          path
        ) VALUES ($1, $2)
        RETURNING id
      `

      let values = [
        filename,
        path.replace(/\\/g, "/" ),
      ]

      let results  = await db.query(query, values)
      const fileId = results.rows[0].id


      query = `
        INSERT INTO recipe_files (
          recipe_id,
          file_id
        ) VALUES ($1, $2)
        RETURNING id
      `

      values = [
        recipeId,
        fileId
      ]

      return db.query(query, values)

    } catch (error) {
      console.error(error)
    }
  },
  find(recipeId) {
    const query = `
      SELECT * 
      FROM files
      WHERE id IN (
        SELECT file_id
        FROM recipe_files
        WHERE recipe_id = $1
      )
      ORDER BY id
    `

    return db.query(query, [recipeId])
  },  
  async deleteRecipeFile(id) {
    try {
      const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
      const file   = result.rows[0]

      fs.unlinkSync(file.path)

      await db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id])

      return db.query(`DELETE FROM files WHERE id = $1`, [id])

    } catch (error) {
      console.error(error)
    }
  }
}