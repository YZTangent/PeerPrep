const request = require('supertest');
const db = require('../models');
const app = require('./app.spec.js');
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const User = db.user;
const Role = db.role;

describe('signup function', () => {
  let user;
  beforeEach(async () => {
    user = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password',
    };
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user with default role', async () => {
    var res = await request(app)
      .post('/user/signup')
      .send(user);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User was registered successfully!');

    const savedUser = await User.findOne({ username: user.username });
    const userRole = await Role.findOne({ name: 'user' });
    //Verify User Fields
    expect(savedUser).toBeDefined();
    expect(savedUser.username).toBe(user.username);
    expect(savedUser.email).toBe(user.email);
    expect(savedUser.roles[0]._id).toEqual(userRole._id);
  });

  it('should create admin account', async () => {
    user.roles = ['admin'];
    var res = await request(app)
      .post('/user/signup')
      .send(user);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User was registered successfully!');

    const savedUser = await User.findOne({ username: user.username });
    const userRole = await Role.findOne({ name: 'admin' });
    //Verify User Fields
    expect(savedUser).toBeDefined();
    expect(savedUser.username).toBe(user.username);
    expect(savedUser.email).toBe(user.email);
    expect(savedUser.roles[0]._id).toEqual(userRole._id);
  });

  it('should stop duplicate usernames', async () => {
    var res = await request(app)
      .post('/user/signup')
      .send(user);

    res = await request(app)
      .post('/user/signup')
      .send(user);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Username is already in use!');
  });


  it('should stop duplicate emails', async () => {
      var res = await request(app)
        .post('/user/signup')
        .send(user);

      user.username = 'testuser2';

      res = await request(app)
        .post('/user/signup')
        .send(user);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email is already in use!');
  });
});

describe('signin function', () => {
  let user;
  beforeAll(async () => {
    user = {
      username: 'testuser',
      password: 'password',
      email: 'testuser@example.com'
    };
    var res = await request(app)
      .post('/user/signup')
      .send(user);
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it('should signin correctly', async () => {
    var res = await request(app)
      .post('/auth/signin')
      .send(user);

    const savedUser = await User.findOne({ username: user.username });
    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(String(savedUser._id));
    expect(res.body.username).toBe(savedUser.username);
    expect(res.body.email).toBe(savedUser.email);
    expect(res.body.roles[0]).toBe('ROLE_USER');
    expect(res.body.token).toBeDefined();
    const tokenVal = jwt.verify(res.body.token, config.secret);
    expect(tokenVal['id']).toEqual(String(savedUser._id));
  });

  it('should return user not found', async () => {
    var userTest = {
      username: 'wrongUsername',
      password: user.password,
    }
    var res = await request(app)
      .post('/auth/signin')
      .send(userTest);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User Not found.");
  });

  it('should return password is wrong', async () => {
    var userTest = {
        username: user.username,
        password: 'wrongPassword',
    }
    var res = await request(app)
        .post('/auth/signin')
        .send(userTest);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid Credentials!");
  });
});

describe('signout function', () => {
  afterEach(async () => {
    await User.deleteMany({});
  });
  it('should signout clear the session', async () => {
    let user = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password',
    };

    var res = await request(app)
      .post('/user/signup')
      .send(user);
    res = await request(app)
      .post('/auth/signin')
      .send(user);
    res = await request(app)
      .post('/auth/signout')
      .send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("You've been signed out!");
  });
});