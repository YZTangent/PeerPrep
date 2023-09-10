module.exports = app => {
    const users = require("../controller/user.controller.js");
  
    var router = require("express").Router();
  
    // Create a new User
    router.post("/", users.create);
  
    // Retrieve a single User with username
    router.get("/", users.findOne);
  
    // Update a User with username
    router.put("/", users.update);
  
    // Delete a User with username
    router.delete("/", users.delete);
  
    // Delete all Users
    router.delete("/", users.deleteAll);
  
    app.use('/api/users', router);
  };