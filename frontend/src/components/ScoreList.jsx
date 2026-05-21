import ScoreItem from './ScoreItem';

function ScoreList({ scores, loadScores, currentUser, showUsername }) {
  return (
    <ul id="score-list">
      {scores.map((score) => (
        <ScoreItem
          key={score.score_id}
          score={score}
          loadScores={loadScores}
          currentUser={currentUser}
          showUsername={showUsername}
        />
      ))}
    </ul>
  );
}

export default ScoreList;
