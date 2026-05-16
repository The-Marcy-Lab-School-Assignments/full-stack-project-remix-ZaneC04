import { createScore } from '../adapters/score-adapters';

// TODO: update to be addScoreForm, use fetch for genres

function AddScoreForm({ loadScores }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const gameTitle = form.elements.gameTitle.value;
    const scoreType = form.elements.scoreType.value;
    const score = form.elements.score.value;
    const genreID = form.elements.genreID.value;
    if (!gameTitle || !scoreType || !score || !genreID) return;

    const { error } = await createScore(gameTitle, scoreType, score, genreID);
    if (error) return console.error(error);

    await loadScores();
    form.reset();
  };

  return (
    <form id="add-todo-form" onSubmit={handleSubmit}>
      <label htmlFor="title-input">New Todo:</label>
      <input type="text" name="title" id="title-input" placeholder="What needs to be done?" />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddScoreForm;
