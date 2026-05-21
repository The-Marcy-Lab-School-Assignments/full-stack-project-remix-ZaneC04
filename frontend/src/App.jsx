import { useState, useEffect } from 'react';
import { getMe, login, register, logout } from './adapters/auth-adapters';
import AuthPage from './components/AuthPage';
import ScorePage from './components/ScorePage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('all')
  // On every page load, check the server for an active session cookie.
  // React state doesn't survive a refresh; session cookies do.
  useEffect(() => {
    const checkForSession = async () => {
      const { data: user } = await getMe();
      setCurrentUser(user);
    };
    checkForSession();
  }, []);

  // Handlers that manage updating the current user. 
  // Defined in App to ensure that child components only                       
  // update the current user in a controlled manner.  
  const handleLogin = async (username, password) => {
    const { data: user, error } = await login(username, password);
    if (error) return error;
    setCurrentUser(user);
  };

  const handleRegister = async (username, password) => {
    const { data: user, error } = await register(username, password);
    if (error) return error;
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
  };

  return (
    <main>
      <h1>Score.Points (Score Tracker)</h1>
      {currentUser
        ? <ScorePage currentUser={currentUser} handleLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab}/>
        : <AuthPage handleLogin={handleLogin} handleRegister={handleRegister} />
      }
    </main>
  );
}

export default App;
