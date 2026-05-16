import { useState, useEffect } from 'react';
import { fetchAllScores, fetchMyScores } from '../adapters/score-adapters';
import AddScoreForm from './AddScoreForm';
import ScoreList from './ScoreList';
import AccountPage from './AccountPage'

// TODO: update to be scorePage, handle loading scores for all users and current user

function ScorePage({ currentUser, handleLogout, activeTab }) {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadScores = async () => {
  setIsLoading(true);
  setError(null);
  const fetcher = activeTab === 'mine' ? fetchMyScores : fetchAllScores;
  const { data, error: fetchError } = await fetcher();
  if (fetchError) {
    setError(fetchError.message);
  } else {
    setScores(data);
  }
  setIsLoading(false);
  };

  useEffect(() => {
    loadScores();
  }, [activeTab]);

  return (
  <section>
    <nav>
      <button onClick={() => setActiveTab('all')}>All Scores</button>
      <button onClick={() => setActiveTab('mine')}>My Scores</button>
      <button onClick={() => setActiveTab('add')}>Add Score</button>
      <button onClick={() => setActiveTab('account')}>Account</button>
    </nav>

    {isLoading && <p>Loading scores...</p>}
    {error && <p className="error">Something went wrong: {error}</p>}
    {activeTab === 'all' && <ScoreList scores={scores} loadScores={loadScores} currentUser={currentUser} />}
    {activeTab === 'mine' && <ScoreList scores={scores} loadScores={loadScores} currentUser={currentUser} />}
    {activeTab === 'add' && <AddScoreForm loadScores={loadScores} setActiveTab={setActiveTab} />}
    {activeTab === 'account' && <AccountPage currentUser={currentUser} handleLogout={handleLogout} />}
  </section>
);
}

export default ScorePage;
