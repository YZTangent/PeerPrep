process.env.JASMINE = true;

const request = require('supertest');
const db = require('../models');
const app = require('../index.js');
var bcrypt = require('bcryptjs');
const e = require('express');

const User = db.user;

describe("updateUser function", () => {
  let user;
  let agent;

  beforeAll(async () => {
    user = {
      username: "testuser",
      email: "testuser@example.com",
      password: "testpassword",
    };

    var res = await request(app)
      .post("/auth/signup")
      .send(user);
    
    agent = request.agent(app, {withCredentials: true});

    res = await agent
      .post("/auth/signin")
      .send({ username: "testuser", password: "testpassword" });
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should update the user's password", async () => {
    const res = await agent
      .post("/user/updateUser")
      .send({ newPassword: "newpassword" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Password was updated successfully!");

    const updatedUser = await User.findOne({ username: user.username });
    expect(bcrypt.compareSync("newpassword", updatedUser.password)).toBe(true);
  });

});

describe("deleteUser function", () => {
  let user;
  let agent;

  beforeAll(async () => {
    user = {
      username: "testuser",
      email: "testuser@example.com",
      password: "testpassword",
    };

    var res = await request(app)
      .post("/auth/signup")
      .send(user);
    
    agent = request.agent(app, {withCredentials: true});

    res = await agent
      .post("/auth/signin")
      .send({ username: "testuser", password: "testpassword" });
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should delete the user", async () => {
    const res = await agent.post("/user/deleteUser");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User was deleted successfully!");

    const deletedUser = await User.findOne({ username: user.username });
    expect(deletedUser).toBeNull();
  });
});

describe("findAll function", () => {
  let adminAccount;
  let user1;
  let user2;
  let user3;
  let agent;

  beforeAll(async () => {
    adminAccount = {
      username: "admin",
      email: "admin@example.com",
      password: "adminpassword",
      roles: ["admin"]
    };

    var res = await request(app)
      .post("/auth/signup")
      .send(adminAccount);
    
    agent = request.agent(app, {withCredentials: true})
    
    res = await agent
      .post("/auth/signin")
      .send({ username: "admin", password: "adminpassword" });

    user1 = {
      username: "user1",
      email: "user1@example.com",
      password: "user1password",
    };

    user2 = {
      username: "user2",
      email: "user2@example.com",
      password: "user2password",
    };

    user3 = {
      username: "user3",
      email: "user3@example.com",
      password: "user3password",
    };

    res = await request(app)
      .post("/auth/signup")
      .send(user1);
    res = await request(app)
      .post("/auth/signup")
      .send(user2);
    res = await request(app)
      .post("/auth/signup")
      .send(user3);
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should return all users", async () => {
    const res = await agent.get("/user/allUsers");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(4);

    expect(res.body[0].username).toBe(adminAccount.username);
    expect(res.body[0].email).toBe(adminAccount.email);
    expect(res.body[0].roles[0]).toBe("admin");

    expect(res.body[1].username).toBe(user1.username);
    expect(res.body[1].email).toBe(user1.email);
    expect(res.body[1].roles[0]).toBe("user");

    expect(res.body[2].username).toBe(user2.username);
    expect(res.body[2].email).toBe(user2.email);
    expect(res.body[2].roles[0]).toBe("user");

    expect(res.body[3].username).toBe(user3.username);
    expect(res.body[3].email).toBe(user3.email);
    expect(res.body[3].roles[0]).toBe("user");
  });

  it("should update if user is removed", async () => {
    User.findOneAndDelete({ username: user2.username }).exec();
    const res = await agent.get("/user/allUsers");

    expect(res.body[0].username).toBe(adminAccount.username);
    expect(res.body[0].email).toBe(adminAccount.email);
    expect(res.body[0].roles[0]).toBe("admin");

    expect(res.body[1].username).toBe(user1.username);
    expect(res.body[1].email).toBe(user1.email);
    expect(res.body[1].roles[0]).toBe("user");

    expect(res.body[2].username).toBe(user3.username);
    expect(res.body[2].email).toBe(user3.email);
    expect(res.body[2].roles[0]).toBe("user");
  });
});
