import { updateScore, deleteScore } from '../adapters/score-adapters';

// TODO: update to be scoreItem that has genre, game title, username and score and score type, make page for all users scores when logged in


function ScoreItem({ score, loadScores }) {
  const handleChange = async (e) => {
    const { error } = await updateScore(score.score_id, newScore);
    if (error) return console.error(error);
    loadScores();
  };

  const handleDelete = async () => {
    const { error } = await deleteScore(score.score_id);
    if (error) return console.error(error);
    loadScores();
  };

  return (
    <li className="score-item">
      <input
        type="checkbox"
        checked={todo.is_complete}
        onChange={handleChange}
      />
      <span className={todo.is_complete ? 'completed' : ''}>{todo.title}</span>
      <button className="delete-btn" onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default TodoItem;
