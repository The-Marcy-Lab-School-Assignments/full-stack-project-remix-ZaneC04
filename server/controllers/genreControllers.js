const genreModel = require('../models/genreModel');

module.exports.listGenres = async (req, res, next) => {
  try {
    const genres = await genreModel.list();
    res.send(genres);
  } catch (err) {
    next(err);
  }
};