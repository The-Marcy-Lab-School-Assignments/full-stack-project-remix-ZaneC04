const pool = require('../db/pool');


// returns all genres 
module.exports.list = async () => {
    const query = 'SELECT * FROM genres'
    const { rows } = await pool.query(query)
    return rows
};