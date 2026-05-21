// TODO: rename to scoreModel, create listByUser (list users scores from user_id), 
// find (find score by score_id), create (create new score), update (update score value), 
// destroy (delete score by score_id) (DONE)
// addGenre that takes in score id and genre id and adds to scores_genre table
const pool = require('../db/pool');

module.exports.list = async (genre_id) => {
  const query = `SELECT scores.*, genres.genre, users.username
    FROM scores
    JOIN scores_genres ON scores.score_id = scores_genres.score_id
    JOIN genres ON scores_genres.genre_id = genres.genre_id
    JOIN users ON scores.user_id = users.user_id
    ${genre_id ? 'WHERE genres.genre_id = $1' : ''}
    ORDER BY scores.score_id ASC
  `;
  const { rows } = await pool.query(query, genre_id ? [genre_id] : []);
  return rows;
};

// Returns all scores for a specific user, ordered by creation time
module.exports.listByUser = async (user_id, genre_id) => {
  const query = `
    SELECT scores.*, genres.genre
    FROM scores
    JOIN scores_genres ON scores.score_id = scores_genres.score_id
    JOIN genres ON scores_genres.genre_id = genres.genre_id
    WHERE scores.user_id = $1
    ${genre_id ? 'AND genres.genre_id = $2' : ''}
    ORDER BY scores.score_id ASC
  `;
  const { rows } = await pool.query(query, genre_id ? [user_id, genre_id] : [user_id]);
  return rows;
};


// Returns a single score row (used for ownership checks before update/delete)
module.exports.find = async (score_id) => {
  const query = 'SELECT * FROM scores WHERE score_id = $1';
  const { rows } = await pool.query(query, [score_id]);
  return rows[0] || null;
};

// Creates a new score. Returns the full score row.
module.exports.create = async (game_title, score_type, score, user_id) => {
  const query = 'INSERT INTO scores (game_title, score_type, score, user_id) VALUES ($1, $2, $3, $4) RETURNING *';
  const { rows } = await pool.query(query, [game_title, score_type, score, user_id]);
  return rows[0];
};

// creates new genre score association in scores_genres
module.exports.addGenre = async (score_id, genre_id) => {
  const query = 'INSERT INTO scores_genres (score_id, genre_id) VALUES ($1, $2) RETURNING *'
  const { rows } = await pool.query(query, [score_id, genre_id])
  return rows[0]
}

// Updates the score for a score. Returns the updated row.
module.exports.update = async (score_id, score) => {
  const query = 'UPDATE scores SET score = $1 WHERE score_id = $2 RETURNING *';
  const { rows } = await pool.query(query, [score, score_id]);
  return rows[0];
};

// Deletes a score by id, deletes the genre association from ON DELETE CASCADE
module.exports.destroy = async (score_id) => {
  const query = 'DELETE FROM scores WHERE score_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [score_id]);
  return rows[0] || null;
};
