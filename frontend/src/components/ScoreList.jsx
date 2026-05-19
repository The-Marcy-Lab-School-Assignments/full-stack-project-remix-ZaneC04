import ScoreItem from './ScoreItem';

// TODO: update to be scoreList, use for all scores page and users scores

function ScoreList({ scores, loadScores, currentUser }) {
  return (
    <ul id="score-list">
      {scores.map((score) => (
        <ScoreItem
          key={score.score_id}
          score={score}
          loadScores={loadScores}
          currentUser={currentUser}
        />
      ))}
    </ul>
  );
}

export default ScoreList;
