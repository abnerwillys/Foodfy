const db = require('../../config/db')
// const { hash } = require('bcryptjs');


module.exports = {
  async findAll() {
    try {
      const query = `SELECT * FROM users`;

      const results = await db.query(query);

      return results.rows;
    } catch (error) {
      console.error(error);
    }
  },
  async findOne(filters) {
    try {
      let query = `SELECT * FROM users`;

      Object.keys(filters).map((key) => {
        query = `${query}
        ${key}
        `;

        Object.keys(filters[key]).map((field) => {
          query = `${query} ${field} = '${filters[key][field]}'`;
        });
      });

      const results = await db.query(query);

      return results.rows[0];
    } catch (error) {
      console.error(error);
    }
  },
  async create(data) {
    try {
      const query = `
        INSERT INTO users (
          name,
          email,
          password,
          reset_token,
          reset_token_expires,
          is_admin          
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `;

      // const passwordHash = await hash(data.password, 8);
      const passwordTemp = '12345'

      const values = [
        data.name,
        data.email,
        passwordTemp,
        data.reset_token,
        data.reset_token_expires,
        data.is_admin || '0'
      ];

      const results = await db.query(query, values);

      return results.rows[0].id;
    } catch (error) {
      console.error(error);
    }
  },
  async update(id, fields) {
    try {
      let query = `UPDATE users SET`;

      Object.keys(fields).map((key, index, array) => {
        if (index + 1 < array.length) {
          query = `${query}
            ${key} = '${fields[key]}',
          `;
        } else {
          query = `${query}
            ${key} = '${fields[key]}'
            WHERE id = ${id}
          `;
        }
      });

      await db.query(query);
      return;

    } catch (error) {
      console.error(error)
    }
  },
  async delete(id) {
    try {
      let results = await db.query('SELECT * FROM products WHERE user_id = $1',[id]);

      const products = results.rows;

      const allFilesPromise = products.map((product) =>
        Product.files(product.id)
      );

      let promiseResults = await Promise.all(allFilesPromise);

      await db.query(`DELETE FROM users WHERE id = $1`, [id]);

      promiseResults.map((results) => {
        results.rows.map((file) => {
          try {
            fs.unlinkSync(file.path)
            
          } catch (error) {
            console.error(error)
          }
        });
      });

    } catch (error) {
      console.error(error);
    }
  },
};
