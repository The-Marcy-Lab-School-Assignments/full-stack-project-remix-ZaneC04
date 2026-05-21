
const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');
require('dotenv').config();

const logRoutes = require('./middleware/logRoutes');
const checkAuthentication = require('./middleware/checkAuthentication');
const authControllers = require('./controllers/authControllers');
const scoreControllers = require('./controllers/scoreControllers');
const genreControllers = require('./controllers/genreControllers')

const app = express();
const PORT = process.env.PORT || 8080;

// ====================================
// Middleware
// ====================================

app.use(logRoutes);
app.use(cookieSession({ name: 'session', secret: process.env.SESSION_SECRET }));
app.use(express.json());

// In production, serve the built React app from frontend/dist.
// In development, Vite's dev server handles the frontend on a separate port
// and proxies /api requests to this server.
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// ====================================
// Auth routes
// ====================================

app.post('/api/auth/register', authControllers.register);
app.post('/api/auth/login', authControllers.login);
app.get('/api/auth/me', authControllers.getMe);
app.delete('/api/auth/logout', authControllers.logout);

// ====================================
// Score routes (all require authentication)
// ====================================

app.get('/api/scores', checkAuthentication, scoreControllers.listAllScores);
app.get('/api/scores/me', checkAuthentication, scoreControllers.listMyScores)
app.post('/api/scores', checkAuthentication, scoreControllers.createScore);
app.patch('/api/scores/:score_id', checkAuthentication, scoreControllers.updateScore);
app.delete('/api/scores/:score_id', checkAuthentication, scoreControllers.deleteScore);

// ====================================
// Genre routes (all require authentication)
// ====================================
 
app.get('/api/genres', checkAuthentication, genreControllers.listGenres);
 
// ====================================
// Global Error Handler
// ====================================

const handleError = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: 'Internal Server Error' });
};
app.use(handleError);

// ====================================
// Listen
// ====================================

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
