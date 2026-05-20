import { createScore, fetchGenres } from '../adapters/score-adapters';
import { useEffect, useState } from 'react';
// TODO: update to be addScoreForm, use fetch for genres

function AddScoreForm({ loadScores, setActiveTab, genres }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const gameTitle = form.elements.gameTitle.value;
    const scoreType = form.elements.scoreType.value;
    const score = form.elements.score.value;
    const genreID = form.elements.genres.value;
    if (!gameTitle || !scoreType || !score || !genreID) return;

    const { error } = await createScore(gameTitle, scoreType, score, genreID);
    if (error) return console.error(error);

    await loadScores();
    form.reset();
    setActiveTab('mine')
  };

  useEffect(() => {
  const loadGenres = async () => {
    const { data } = await fetchGenres();
    setGenres(data);
    };
    loadGenres();
  }, []);

  return (
    <form id="add-score-form" onSubmit={handleSubmit}>
      <h2>New Score:</h2>

      <div>
        <label htmlFor="gameTitle">Game Title:</label>
      <input type="text" name='gameTitle' placeholder='League of Legends, Minecraft, etc...'/>
      </div>

      <div>
        <label htmlFor="scoreType">Score Type:</label>
      <input type="text" name='scoreType'placeholder='Time, Team Score, etc...'/>
      </div>
      
      <div>
        <label htmlFor="score">Score:</label>
        <input type="text" name='score'/>
      </div>
      
      <div id='genre-row'>
        <label htmlFor="genres">Game Genre:</label>
        <select name="genres" id="genre" className='genre-dropdown'>
        {genres.map(genre => 
          <option className="genre-name" key={genre.genre_id} value={genre.genre_id}>{genre.genre}</option>)}
        </select>
      </div>
      
      <button id="submit-score-btn" type="submit">Add Score</button>
    </form>
  );
}

export default AddScoreForm;
