function AccountPage({ currentUser, handleLogout }) {
  return (
    <div id="user-controls">
        <span className="welcome-user">Welcome, <strong>{currentUser.username}</strong>!</span>
        <span>User ID: {currentUser.user_id}</span>
        <button onClick={handleLogout}>Log Out</button>
      </div>
  )
}

export default AccountPage;
 
