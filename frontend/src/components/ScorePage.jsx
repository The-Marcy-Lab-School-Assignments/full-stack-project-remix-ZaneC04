import { useState, useEffect } from 'react';
import { fetchAllScores, fetchMyScores, fetchGenres } from '../adapters/score-adapters';
import AddScoreForm from './AddScoreForm';
import ScoreList from './ScoreList';
import AccountPage from './AccountPage'

// TODO: update to be scorePage, handle loading scores for all users and current user

function ScorePage({ currentUser, handleLogout, activeTab, setActiveTab }) {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);
  const [allGenreId, setAllGenreId] = useState('');
  const [myGenreId, setMyGenreId] = useState('');


  useEffect(() => {
    const loadGenres = async () => {
      const { data } = await fetchGenres();
      if (data) setGenres(data);
    };
    loadGenres();
  }, []);
 
    const loadScores = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = activeTab === 'mine'
      ? await fetchMyScores(myGenreId || null)
      : await fetchAllScores(allGenreId || null);
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setScores(data);
    }
    setIsLoading(false);
  };
 
  useEffect(() => {
    loadScores();
  }, [activeTab, allGenreId, myGenreId]);

    return (
    <section>
      <nav>
        <button onClick={() => setActiveTab('all')}>All Scores</button>
        <button onClick={() => setActiveTab('mine')}>My Scores</button>
        <button onClick={() => setActiveTab('add')}>Add Score</button>
        <button onClick={() => setActiveTab('account')}>Account</button>
      </nav>
 
      {activeTab === 'all' && (
        <div id="genre-filter-row">
          <label htmlFor="all-genre-filter">Filter by genre:</label>
          <select
            id="all-genre-filter"
            className="genre-dropdown"
            value={allGenreId}
            onChange={(e) => setAllGenreId(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre.genre_id} value={genre.genre_id}>{genre.genre}</option>
            ))}
          </select>
        </div>
      )}
      {isLoading && <p>Loading scores...</p>}
      {error && <p className="error">Something went wrong: {error}</p>}
      {activeTab === 'all' && <ScoreList scores={scores} loadScores={loadScores} currentUser={currentUser} showUsername={true} />}
      {activeTab === 'mine' && (
        <div id="genre-filter-row">
          <label htmlFor="my-genre-filter">Filter by genre:</label>
          <select
            id="my-genre-filter"
            className="genre-dropdown"
            value={myGenreId}
            onChange={(e) => setMyGenreId(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre.genre_id} value={genre.genre_id}>{genre.genre}</option>
            ))}
          </select>
        </div>
      )}
      {activeTab === 'mine' && <ScoreList scores={scores} loadScores={loadScores} currentUser={currentUser} />}
      {activeTab === 'add' && <AddScoreForm loadScores={loadScores} setActiveTab={setActiveTab} genres={genres} />}
      {activeTab === 'account' && <AccountPage currentUser={currentUser} handleLogout={handleLogout} />}
    </section>
  );
}

export default ScorePage;
