// TODO: create scores, genres, and scores_genres tables and drop in reverse dependency (DONE)
// TODO: change seeded users and insert into users table (DONE)
// TODO: add data to scores, genres, and score_genres tables and delete todos data (DONE)

const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  await pool.query('DROP TABLE IF EXISTS scores_genres CASCADE');
  await pool.query('DROP TABLE IF EXISTS scores CASCADE');
  await pool.query('DROP TABLE IF EXISTS genres CASCADE');
  await pool.query('DROP TABLE IF EXISTS users CASCADE');

  

  await pool.query(`
    CREATE TABLE users (
      user_id       SERIAL PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE genres (
      genre_id SERIAL PRIMARY KEY,
      genre TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE scores (
      score_id    SERIAL PRIMARY KEY,
      game_title  TEXT NOT NULL,
      score_type  TEXT NOT NULL,
      score       TEXT NOT NULL,
      user_id     INT REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE scores_genres (
      score_genre_id SERIAL PRIMARY KEY,
      score_id INTEGER REFERENCES scores(score_id) ON DELETE CASCADE,
      genre_id INTEGER REFERENCES genres(genre_id) ON DELETE CASCADE,
      UNIQUE (score_id, genre_id)
    )
  `);

  const [willHash, chrisHash, jojoHash, gabeHash] = await Promise.all([
    bcrypt.hash('password123', SALT_ROUNDS),
    bcrypt.hash('password123', SALT_ROUNDS),
    bcrypt.hash('password123', SALT_ROUNDS),
    bcrypt.hash('password123', SALT_ROUNDS),
  ]);

  const { rows: users } = await pool.query(`
    INSERT INTO users (username, password_hash) VALUES
      ('will', $1),
      ('chris',   $2),
      ('jojo',   $3),
      ('gabe',   $4)
    RETURNING user_id, username
  `, [willHash, chrisHash, jojoHash, gabeHash]);

  const [will, chris, jojo, gabe] = users;

  const { rows: genres } = await pool.query(`
    INSERT INTO genres (genre) VALUES
    ('Puzzle'),
    ('Rhythm'),
    ('Sports'),
    ('Rougelite/like'),
    ('Team-Based'),
    ('Other')
    RETURNING genre_id, genre
    `)

    const [puzzle, rhythm, sports, roguelite, teamBased, other] = genres;

  const { rows: scores } = await pool.query(`
    INSERT INTO scores (game_title, score_type, score, user_id) VALUES
      ('Rhythm-Revolvers', 'Highscore', '11400', $1),
      ('osu!', 'Rank (Play Points)', '4715pp', $1),
      ('Marvel Rivals', 'K/D/A', '50/6/13', $1),
      ('Arcaea', 'Rank (Potential)', '11.03', $2),
      ('vivid/stasis', 'Rank (Rating)', '21400', $2),
      ('statle.fun', 'Highscore', '395', $3),
      ('Pokémon Showdown', 'Rank', '1660', $3),
      ('NBA 2K25', 'Highscore', '25-7', $3),
      ('Minecraft: Java Edition', 'Time', '7m 16sec', $3),
      ('Geometry Dash', 'Rank (List Points)', '62.15', $4),
      ('Minesweeper (Intermediate)', 'Time', '63sec', $4)
      RETURNING score_id, game_title
  `, [will.user_id, chris.user_id, jojo.user_id, gabe.user_id]);

const [rhythmRevolvers, osu, marvelRivals, arcaea, vividStasis, statle, pokemonShowdown, nba2k25, minecraft, geometryDash, minesweeper] = scores;

  await pool.query(`
    INSERT INTO scores_genres (score_id, genre_id) VALUES 
      ($1,  $2), 
      ($3,  $2), 
      ($4,  $5),   
      ($6,  $2),   
      ($7,  $2),  
      ($8,  $9),  
      ($10, $11), 
      ($12, $13), 
      ($14, $11),  
      ($15, $16),  
      ($17, $9)    
    `, [
    rhythmRevolvers.score_id, rhythm.genre_id,    // $1,  $2
    osu.score_id,                                  // $3  (reuses $2 for rhythm)
    marvelRivals.score_id, teamBased.genre_id,     // $4,  $5
    arcaea.score_id,                               // $6  (reuses $2 for rhythm)
    vividStasis.score_id,                          // $7  (reuses $2 for rhythm)
    statle.score_id, puzzle.genre_id,              // $8,  $9
    pokemonShowdown.score_id, other.genre_id,      // $10, $11
    nba2k25.score_id, sports.genre_id,             // $12, $13
    minecraft.score_id,                            // $14 (reuses $11 for other)
    geometryDash.score_id, roguelite.genre_id,     // $15, $16
    minesweeper.score_id,                          // $17 (reuses $9 for puzzle)
  ]);

  return users;
};

seed()
  .then((users) => {
    console.log('Database seeded successfully.');
    console.log(`  Users: ${users.map((u) => u.username).join(', ')}`);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
