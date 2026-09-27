const request = require('supertest')
const app = require('../index')
const userModel = require('../models/userModel');
const scoreModel = require('../models/scoreModel');

//////////////////
// Model Mocks
//////////////////

jest.mock('../models/userModel')
jest.mock('../models/scoreModel')

//////////////////
// List Scores
//////////////////

describe('GET /api/scores', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all scores, regardless of user', async () => {
        const agent = request.agent(app);

        userModel.validatePassword.mockResolvedValue({ user_id: 1, username: 'will' }); 
        await agent.post('/api/auth/login').send({ username: 'will', password: 'password' }); // logs in
        
        scoreModel.list.mockResolvedValue([
            { score_id: 1, game_title: 'osu!', score_type: 'Rank', score: '4715pp', user_id: 2 },
            { score_id: 2, game_title: 'Tetris', score_type: 'Highscore', score: '999999', user_id: 3 }
        ])


        const response = await agent.get('/api/scores');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty('score_id');
        expect(response.body[0]).toHaveProperty('game_title');
    })

    it('should pass genre_id through to scoreModel.list when provided', async () => {
    const agent = request.agent(app);

    userModel.validatePassword.mockResolvedValue({ user_id: 1, username: 'will' });
    await agent.post('/api/auth/login').send({ username: 'will', password: 'password' });

    scoreModel.list.mockResolvedValue([
        { score_id: 1, game_title: 'osu!', score_type: 'Rank', score: '4715pp', user_id: 2, genre: 'Rhythm' },
    ]);

    const response = await agent.get('/api/scores?genre_id=2');

    expect(response.statusCode).toBe(200);
    expect(scoreModel.list).toHaveBeenCalledWith('2');
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('score_id');
    expect(response.body[0]).toHaveProperty('game_title');
    });
})

//////////////////
// List My Scores
//////////////////

describe('GET /api/scores/me', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should only return the users scores', async () => {
        const agent = request.agent(app);

        userModel.validatePassword.mockResolvedValue({ user_id: 1, username: 'will' });
        await agent.post('/api/auth/login').send({ username: 'will', password: 'password' });

        scoreModel.listByUser.mockResolvedValue([
            { score_id: 1, game_title: 'osu!', score_type: 'Rank', score: '2000pp', user_id: 1 },
            { score_id: 2, game_title: 'osu!', score_type: 'Rank', score: '4715pp', user_id: 1 },
            { score_id: 3, game_title: 'Tetris', score_type: 'Highscore', score: '999999', user_id: 1 }
        ]);

        const response = await agent.get('/api/scores/me');

        expect(response.statusCode).toBe(200);
        expect(scoreModel.listByUser).toHaveBeenCalledWith(1, undefined);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(3);
        expect(response.body[0]).toHaveProperty('score_id');
        expect(response.body[0]).toHaveProperty('game_title');
    });
})

//////////////////
// Create New Score
//////////////////

describe('POST /api/scores', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it('should successfully create a new score with a 201 status code', async () => {
        const agent = request.agent(app);

        userModel.validatePassword.mockResolvedValue({ user_id: 1, username: 'will' });
        await agent.post('/api/auth/login').send({ username: 'will', password: 'password' });

        scoreModel.create.mockResolvedValue({ score_id: 1, game_title: 'osu!', score_type: 'Rank', score: '2000pp', user_id: 1 });
        scoreModel.addGenre.mockResolvedValue(undefined);

        const response = await agent
            .post('/api/scores')
            .send({ game_title: 'osu!', score_type: 'Rank', score: '2000pp', genre_id: 1 });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('score_id');
        expect(response.body).toHaveProperty('game_title');
    })

    it('should fail with a 400 code if all fields are not added', async () => {
        const agent = request.agent(app);

        userModel.validatePassword.mockResolvedValue({ user_id: 1, username: 'will' });
        await agent.post('/api/auth/login').send({ username: 'will', password: 'password' });

        const response = await agent
            .post('/api/scores')
            .send({ game_title: 'osu!', score_type: 'Rank', score: '2000pp' }); // missing genre_id

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error');
    })
})

//////////////////
// Update Score
//////////////////

describe('PATCH /api/scores/:score_id', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should update the specified score with a 200 status code on success", async () => {
        const agent = request.agent(app);

        userModel.validatePassword.mockResolvedValue({ user_id: 1, username: 'will' });
        await agent.post('/api/auth/login').send({ username: 'will', password: 'password' });

        scoreModel.find.mockResolvedValue({ score_id: 1, game_title: 'osu!', score_type: 'Rank', score: '2000pp', user_id: 1 });
        scoreModel.update.mockResolvedValue({ score_id: 1, game_title: 'osu!', score_type: 'Rank', score: '4715pp', user_id: 1 });

        const response = await agent
            .patch('/api/scores/1')
            .send({ score: '4715pp' });

        expect(response.statusCode).toBe(200);
        expect(scoreModel.update).toHaveBeenCalledWith('1', '4715pp');
        expect(response.body).toHaveProperty('score_id');
        expect(response.body.score).toBe('4715pp');
    })

    it("should fail with a 404 status code if score is not found", async () => {
        const agent = request.agent(app);

        userModel.validatePassword.mockResolvedValue({ user_id: 1, username: 'will' });
        await agent.post('/api/auth/login').send({ username: 'will', password: 'password' });

        scoreModel.find.mockResolvedValue(null);

        const response = await agent
            .patch('/api/scores/999')
            .send({ score: '4715pp' });

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(scoreModel.update).not.toHaveBeenCalled();
    })

    it("should fail with a 403 status code if the user is not the owner of the score", async () => {
        const agent = request.agent(app);

        userModel.validatePassword.mockResolvedValue({ user_id: 1, username: 'will' });
        await agent.post('/api/auth/login').send({ username: 'will', password: 'password' });

        scoreModel.find.mockResolvedValue({ score_id: 1, game_title: 'osu!', score_type: 'Rank', score: '2000pp', user_id: 2 });

        const response = await agent
            .patch('/api/scores/1')
            .send({ score: '4715pp' });

        expect(response.statusCode).toBe(403);
        expect(response.body).toHaveProperty('error');
        expect(scoreModel.update).not.toHaveBeenCalled();
    })

    it("should fail with a 400 status code if score is missing", async () => {
    const agent = request.agent(app);

    userModel.validatePassword.mockResolvedValue({ user_id: 1, username: 'will' });
    await agent.post('/api/auth/login').send({ username: 'will', password: 'password' });

    const response = await agent
        .patch('/api/scores/1')
        .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(scoreModel.find).not.toHaveBeenCalled();
    })
})

//////////////////
// Delete Score
//////////////////

describe('DELETE /api/scores/:score_id', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("should successfully delete a score with a 200 status code if the user owns the score", async () => {
        const agent = request.agent(app);

        userModel.validatePassword.mockResolvedValue({ user_id: 1, username: 'will' });
        await agent.post('/api/auth/login').send({ username: 'will', password: 'password' });

        scoreModel.find.mockResolvedValue({ score_id: 1, game_title: 'osu!', score_type: 'Rank', score: '2000pp', user_id: 1 });
        scoreModel.destroy.mockResolvedValue({ score_id: 1, game_title: 'osu!', score_type: 'Rank', score: '2000pp', user_id: 1 });

        const response = await agent.delete('/api/scores/1');

        expect(response.statusCode).toBe(200);
        expect(scoreModel.destroy).toHaveBeenCalledWith('1');
        expect(response.body).toHaveProperty('score_id');
    })

    it("should fail with a 404 status code if score is not found", async () => {
         const agent = request.agent(app);

        userModel.validatePassword.mockResolvedValue({ user_id: 1, username: 'will' });
        await agent.post('/api/auth/login').send({ username: 'will', password: 'password' });

        scoreModel.find.mockResolvedValue(null);

        const response = await agent.delete('/api/scores/999');

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(scoreModel.destroy).not.toHaveBeenCalled();
    })

    it("should fail with a 403 status code if user does not own the score", async () => {
        const agent = request.agent(app);

        userModel.validatePassword.mockResolvedValue({ user_id: 1, username: 'will' });
        await agent.post('/api/auth/login').send({ username: 'will', password: 'password' });

        scoreModel.find.mockResolvedValue({ score_id: 1, game_title: 'osu!', score_type: 'Rank', score: '2000pp', user_id: 2 });

        const response = await agent.delete('/api/scores/1');

        expect(response.statusCode).toBe(403);
        expect(response.body).toHaveProperty('error');
        expect(scoreModel.destroy).not.toHaveBeenCalled();
    })
})