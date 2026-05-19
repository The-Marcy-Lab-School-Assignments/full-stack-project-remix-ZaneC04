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

   const isOwner = score.user_id === currentUser.user_id;

 return (
    <li className="score-item">
      <div className="score-content">
        <div className="score-top-row">
          <span className="score-val">{score.score}</span>
          <span className="genre-bubble">{score.genre}</span>
        </div>
        <div className="score-bottom-row">
          <span className="game-title-bubble">{score.game_title}</span>
          <span className="score-type-bubble">{score.score_type}</span>
        </div>
      </div>
      {isOwner && (
        <div className="score-button-row">
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
      )}
      {isEditing && (
        <div className="score-button-row">
          <input value={newScore} onChange={(e) => setNewScore(e.target.value)} />
          <button onClick={handleChange}>Confirm</button>
        </div>
      )}
    </li>
  );
}

export default ScoreItem;
