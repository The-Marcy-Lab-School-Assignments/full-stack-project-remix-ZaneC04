import { useState } from 'react';
import { updateScore, deleteScore } from '../adapters/score-adapters';

// TODO: update to be scoreItem that has genre, game title, username and score and score type, make page for all users scores when logged in


function ScoreItem({ score, loadScores, currentUser }) {
  const [isEditing, setIsEditing] = useState(false)
  const [newScore, setNewScore] = useState('')
  
  const handleChange = async (e) => {
    const { error } = await updateScore(score.score_id, newScore);
    if (error) return console.error(error);
    loadScores();
    setIsEditing(false)
  };

  const handleDelete = async () => {
    const { error } = await deleteScore(score.score_id);
    if (error) return console.error(error);
    loadScores();
  };

  return (
    <li className="score-item">
      <span className='score-val'>{score.score}</span>
      <span className='genre-bubble'>{score.genre}</span>
      <span className='game-title-bubble'>{score.game_title}</span>
      <span className='score-type-bubble'>{score.score_type}</span>
      <span className='user-bubble'>{score.username}</span>
      {score.user_id === currentUser.user_id && <button className='edit-btn' onClick={() => setIsEditing(true)}>Edit</button>}
      {isEditing && (<input value={newScore} onChange={(e) => setNewScore(e.target.value)} />)}
      {isEditing && <button onClick={handleChange}>Confirm</button>}
      {score.user_id === currentUser.user_id && <button className="delete-btn" onClick={handleDelete}>Delete</button>}
    </li>
  );
}

export default ScoreItem;
