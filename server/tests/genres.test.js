const request = require('supertest')
const app = require('../index')
const genreModel = require('../models/genreModel');
const userModel = require('../models/userModel');

//////////////////
// Model Mocks
//////////////////

jest.mock('../models/userModel')
jest.mock('../models/genreModel')

//////////////////
// List Genres
//////////////////

describe('GET /api/genres', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of genres', async () => {
        const agent = request.agent(app);

        userModel.validatePassword.mockResolvedValue({ user_id: 1, username: 'will' }); 
        await agent.post('/api/auth/login').send({ username: 'will', password: 'password' }); // logs in

        genreModel.list.mockResolvedValue([
            { genre_id: 1, genre: 'Puzzle' }
        ]);

        const response = await agent.get('/api/genres');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty('genre_id');
        expect(response.body[0]).toHaveProperty('genre');
    })

    it('should return 401 if not logged in', async () => {
        const response = await request(app).get('/api/genres');
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('error');
    });
})