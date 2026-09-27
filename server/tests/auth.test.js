const request = require('supertest')
const app = require('../index')
const userModel = require('../models/userModel');

//////////////////
// Model Mocks
//////////////////

jest.mock('../models/userModel');

//////////////////
// Register
//////////////////

describe('POST /api/auth/register', () => {
    afterEach(() => {
  jest.clearAllMocks();
    });

    it('should create a new user with 201 status code', async () => {
    userModel.findByUsername.mockResolvedValue(null); // Mock, returns no existing user for test
    userModel.create.mockResolvedValue({ user_id: 1, username: 'test123' });

    const response = await request(app)
      .post('/api/auth/register')
      .send({ username: 'test123', password: 'password' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('user_id');
  });

  it('should fail with 400 status code if password is missing', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ username: 'test123', password: '' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should fail with 400 status code if username is missing', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ username: '', password: 'password' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should fail with 400 status code if username is already taken', async () => {
    userModel.findByUsername.mockResolvedValue({ user_id: 1, username: 'will' }); // mocks the real user id shape
    const response = await request(app)
      .post('/api/auth/register')
      .send({ username: 'will', password: 'password' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
})

//////////////////
// Login
//////////////////

describe('POST /api/auth/login', () => {
    afterEach(() => {
  jest.clearAllMocks();
    });
    
    it('should send user id and username on successful login', async () => {
        userModel.validatePassword.mockResolvedValue({user_id: 1, username: 'will'})
        const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'will', password: 'password' });

    expect(response.body).toHaveProperty('user_id');
    expect(response.body).toHaveProperty('username');
    expect(response.statusCode).toBe(200);
    })
    
    it('should fail with 401 if username/password is wrong', async () => {
        userModel.validatePassword.mockResolvedValue(null)
        const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'will', password: 'notpassword' });
    
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error');
    })
})

//////////////////
// getMe
//////////////////

describe('GET /api/auth/me', () => {
    afterEach(() => {
  jest.clearAllMocks();
    });

    it('should return current user on successful find', async () => {
        const agent = request.agent(app);

        userModel.validatePassword.mockResolvedValue({ user_id: 1, username: 'will' });
        await agent.post('/api/auth/login').send({ username: 'will', password: 'password' }); // logs in as user before checking user_id

    
        userModel.find.mockResolvedValue({ user_id: 1, username: 'will' });
        const response = await agent.get('/api/auth/me');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('user_id');
    expect(response.body).toHaveProperty('username');
    })

    it('should return null if there is no current user', async () => {
       const response = await request(app).get('/api/auth/me');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeNull();
    })
})

//////////////////
// Logout
//////////////////

describe('DELETE /api/auth/logout', () => {
    afterEach(() => {
  jest.clearAllMocks();
    });

    it(`should return 'logged out' message on successful logout`, async () => {
        const agent = request.agent(app);

        userModel.validatePassword.mockResolvedValue({ user_id: 1, username: 'will' });
        await agent.post('/api/auth/login').send({ username: 'will', password: 'password' }); // logs in as user to test logout

        const response = await agent.delete('/api/auth/logout')
    
    expect(response.body.message).toBe('Logged out.');
    })

    it('should invalidate the session after logout', async () => {
    const agent = request.agent(app);

    userModel.validatePassword.mockResolvedValue({ user_id: 1, username: 'will' });
    await agent.post('/api/auth/login').send({ username: 'will', password: 'password' });

    await agent.delete('/api/auth/logout');

    const response = await agent.get('/api/auth/me');
    expect(response.body).toBeNull(); // returns null with no session
});
})
