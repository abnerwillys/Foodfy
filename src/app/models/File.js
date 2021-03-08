const db   = require('../../config/db')
const fs   = require('fs')
const Base = require('./Base')

Base.init({ table: 'files' })

module.exports = {
  ...Base,
  async createRecipeFile(fileData, recipeId) {
    try {
      const fileId = await this.create(fileData)

      const query = `
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
  findRecipeFile(recipeId) {
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
  async deleteFile(id, entity) {
    try {
      const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
      const file   = result.rows[0]

      fs.unlinkSync(file.path)

      if (entity === 'recipe') {
        await db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id])
      }

      return db.query(`DELETE FROM files WHERE id = $1`, [id])

    } catch (error) {
      console.error(error)
    }
  },
}