import ScoreItem from './ScoreItem';

// TODO: update to be scoreList, use for all scores page and users scores

function ScoreList({ scores, loadScores, currentUser }) {
  return (
    <ul id="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={score.score_id}
          score={score}
          loadScores={loadScores}
        />
      ))}
    </ul>
  );
}

export default ScoreList;
