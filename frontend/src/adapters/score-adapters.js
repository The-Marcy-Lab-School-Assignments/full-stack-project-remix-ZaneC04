// TODO: change fetches to fetch scores, and update body to req with right data (score value, game title, etc.)

const handleFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Fetch failed. ${response.status} ${response.statusText}`);
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const fetchAllScores = async (genre_id) => {
  const url = genre_id ? `/api/scores?genre_id=${genre_id}` : '/api/scores';
  return handleFetch(url);
};

export const fetchMyScores = async () => {
  return handleFetch('api/scores/me')
}

export const fetchGenres = async () => {
  return handleFetch('api/genres')
}

export const createScore = async (game_title, score_type, score, genre_id) => {
  return handleFetch('/api/scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ game_title, score_type, score, genre_id }),
  });
};

export const updateScore = async (score_id, newScore) => {
  return handleFetch(`/api/scores/${score_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({score: newScore}),
  });
};

export const deleteScore = async (score_id) => {
  return handleFetch(`/api/scores/${score_id}`, { method: 'DELETE' });
};
