const history = require("../controllers/history.controller.js");

module.exports = app => {
  var router = require("express").Router();

  // Create, read or update a history
  router.get("/:questionId/:userId", history.findOne);
  router.post("/:questionId/:userId", history.create);
  router.put("/:questionId/:userId", history.update);
  router.delete("/:questionId", history.delete);

  // Retrieve all history
  router.get("/", history.findAll);
  router.get("/user/:id", history.findUserHistory);
  router.get("/question/:id", history.findQuestionHistory);

  // Delete all history
  router.delete("/", history.deleteAll);

  app.use('/history', router);
};