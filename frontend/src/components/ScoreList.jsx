import ScoreItem from './ScoreItem';

// TODO: update to be scoreList, use for all scores page and users scores

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
