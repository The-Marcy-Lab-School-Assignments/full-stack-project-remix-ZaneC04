# (Project Title) - Game Score Tracker App

A full-stack Game Score Tracking app built with React, Express, and Postgres. Demonstrates session-based authentication, session rehydration, auth-dependent data fetching, and conditional rendering. Perfect for anyone who wants to track their best scores for any genre of game out there.

## User Stories

**Auth**

- A user can register for an account with a username and password
- A user can log in to an existing account
- A user can log out
- A returning user who has an active session is automatically logged in when they revisit the app

**Score Tracking**

- A logged-in user can see all of their scores
- A logged-in user can create a new score by entering a genre of game (puzzle, sports, etc.) the score type (time, points, etc.) and the value.
- A logged-in user can see other users scores, and filter by genre
- A logged-in user can delete a score

## Schema

```
users
─────────────────────────────
user_id       SERIAL PRIMARY KEY
username      TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL

scores
─────────────────────────────
score_id    SERIAL PRIMARY KEY
game_title  TEXT NOT NULL
score_type  TEXT NOT NULL
score       TEXT NOT NULL
user_id     INTEGER REFERENCES users(user_id) ON DELETE CASCADE

genres
─────────────────────────────
genre_id SERIAL PRIMARY KEY
genre TEXT NOT NULL


scores_genres
─────────────────────────────
score_genre_id SERIAL PRIMARY KEY
score_id INTEGER REFERENCES scores(score_id) ON DELETE CASCADE
genre_id INTEGER REFERENCES genres(genre_id) ON DELETE CASCADE
UNIQUE (score_id, genre_id)
```

A user has many scores. Deleting a user cascades to delete all of their scores and their genre associations.

## API Contract

### Auth endpoints

| Method | Endpoint             | Request Body             | Response                          |
| ------ | -------------------- | ------------------------ | --------------------------------- |
| POST   | `/api/auth/register` | `{ username, password }` | `{ user_id, username }`           |
| POST   | `/api/auth/login`    | `{ username, password }` | `{ user_id, username }`           |
| DELETE | `/api/auth/logout`   | —                        | `{ message }`                     |
| GET    | `/api/auth/me`       | —                        | `{ user_id, username }` or `null` |

### Score endpoints (all require authentication)

| Method | Endpoint                | Request Body                                  | Response                                                                  |
| ------ | ----------------------- | --------------------------------------------- | ------------------------------------------------------------------------- |
| GET    | `/api/scores`           | —                                             | `[{ score_id, game_title, score_type, score, user_id, username, genre }]` |
| GET    | `/api/scores/me`           | —                                             | `[{ score_id, game_title, score_type, score, user_id, username, genre }]` |
| GET    | `/api/scores?genre_id=` | —                                             | `[{ score_id, game_title, score_type, score, user_id, username, genre }]` |
| POST   | `/api/scores`           | `{ game_title, score_type, score, genre_id }` | `{ score_id, game_title, score_type, score, user_id, genre }`             |
| PATCH  | `/api/scores/:score_id` | `{ score }`                                   | `{ score_id, score_type, score, user_id, genre }`                         |
| DELETE | `/api/scores/:score_id` | —                                             | `{ score_id, game_title, score_type, score, user_id }`                    |

### Genre endpoints (all require authentication)

| Method | Endpoint      | Request Body | Response                |
| ------ | ------------- | ------------ | ----------------------- |
| GET    | `/api/genres` | —            | `[{ genre_id, genre }]` |

## Setup (PLACEHOLDER)

### 1. Database (PLACEHOLDER)

Create a local Postgres database:

```sh
createdb todos_casestudy
```

### 2. Server (PLACEHOLDER)

```sh
cd server
npm install
cp .env.template .env
```

Open `.env` and fill in your Postgres credentials and a session secret. Then seed the database:

```sh
npm run db:seed
```

Start the server:

```sh
npm run dev
```

The server runs on `http://localhost:8080`.

### 3. Frontend (PLACEHOLDER)

In a second terminal:

```sh
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`. The Vite dev proxy forwards all `/api` requests to the Express server so session cookies work correctly.

## Seed Users (PLACEHOLDER)

After running `npm run db:seed`, these accounts are available:

| Username | Password    |
| -------- | ----------- |
| alice    | password123 |
| bob      | password123 |

## Application Structure

```
(project-root)/
├── frontend/               # React app (Vite)
│   ├── src/
│   │   ├── App.jsx         # Root component: currentUser state, session rehydration, auth handlers
│   │   ├── adapters/
│   │   │   ├── auth-adapters.js   # Fetch adapters for /api/auth/* endpoints
│   │   │   ├── score-adapters.js  # Fetch adapters for /api/scores/* endpoints
│   │   │   └── genre-adapters.js  # Fetch adapters for /api/genres endpoint
│   │   └── components/
│   │       ├── AuthPage.jsx       # Login + Register forms (shown when logged out)
│   │       ├── ScoresPage.jsx     # Main app container (shown when logged in)
│   │       ├── AddScoreForm.jsx   # Form to create a new score with genre selection
│   │       ├── ScoreList.jsx      # Renders a list of ScoreItems, handles genre filter
│   │       └── ScoreItem.jsx      # Single score: value, genres, edit button, delete button
│   └── vite.config.js      # Proxies /api requests to Express in development
└── server/                 # Express + Postgres API
    ├── index.js            # App entry point, route definitions
    ├── controllers/
    │   ├── authControllers.js   # register, login, logout, getMe
    │   ├── scoreControllers.js  # list, create, update, delete scores
    │   └── genreControllers.js  # list genres
    ├── models/
    │   ├── userModel.js         # SQL queries for the users table
    │   ├── scoreModel.js        # SQL queries for the scores and scores_genres tables
    │   └── genreModel.js        # SQL queries for the genres table
    ├── middleware/
    │   ├── checkAuthentication.js  # Blocks unauthenticated requests
    │   └── logRoutes.js            # Logs each incoming request
    └── db/
        ├── pool.js         # Postgres connection pool
        └── seed.js         # Creates tables and inserts sample data
```
