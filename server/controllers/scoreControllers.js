
const scoreModel = require('../models/scoreModel');

module.exports.listAllScores = async (req, res, next) => {
  try {
    const { genre_id } = req.query
    const scores = genre_id ? await scoreModel.list(genre_id) : await scoreModel.list();
    res.send(scores);
  } catch (err) {
    next(err);
  }
};

module.exports.listMyScores = async (req, res, next) => {
  try {
    const { genre_id } = req.query;
    const scores = await scoreModel.listByUser(req.session.user_id, genre_id);
    res.send(scores);
  } catch (err) {
    next(err);
  }
};


module.exports.createScore = async (req, res, next) => {
  try {
    const { game_title, score_type, score, genre_id } = req.body;
    if (!game_title || !score_type || !score || !genre_id) return res.status(400).send({ error: 'All fields are required.' });
    const newScore = await scoreModel.create(game_title, score_type, score, req.session.user_id);
    await scoreModel.addGenre(newScore.score_id, genre_id)
    res.status(201).send(newScore);
  } catch (err) {
    next(err);
  }
};

module.exports.updateScore = async (req, res, next) => {
  try {
    const { score_id } = req.params;
    const score = await scoreModel.find(score_id);
    if (!score) return res.status(404).send({ error: 'Score not found.' });
    if (score.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const updatedScore = await scoreModel.update(score_id, req.body.score);
    res.send(updatedScore);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteScore = async (req, res, next) => {
  try {
    const { score_id } = req.params;

    // First find the score to verify ownership
    const score = await scoreModel.find(score_id);
    if (!score) return res.status(404).send({ error: 'Score not found.' });
    if (score.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    // Destroy the score only after ownership has been verified
    const destroyedScore = await scoreModel.destroy(score_id);
    res.send(destroyedScore);
  } catch (err) {
    next(err);
  }
};
