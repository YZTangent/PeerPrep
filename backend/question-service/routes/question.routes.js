module.exports = app => {
    const questions = require("../controllers/question.controller.js");
  
    var router = require("express").Router();
  
    // Create a new question
    router.post("/", questions.create);
  
    // Retrieve a question using questionId
    router.get("/:questionId", questions.findOne);

    // Retrieve all questions
    router.get("/all", questions.find);
  
    // Update a question using questionId
    router.put("/:questionId", questions.update);
  
    // Delete a question using questionId
    router.delete("/:questionId", questions.delete);
  
    // Delete all questions
    router.delete("/", questions.deleteAll);
  
    app.use('/questions', router);
  };