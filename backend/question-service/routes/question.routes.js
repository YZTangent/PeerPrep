const { default: axios } = require("axios");

module.exports = app => {
  const questions = require("../controllers/question.controller.js");

  var router = require("express").Router();

  verifySession = async (req, res, next) => {
    if (!req.session || !req.session.username) {
      return res.status(403).send({message:"No session found! Please login!"});
    }
    try {
      const authorization = await axios.post('http://127.0.0.1:8001/api/auth/verify', { token: req.session.token });
      if (authorization.status === 200){
        next();
        return;
      } else{
        return res.status(403).send({message:"Token is invalid!"});
      }
    }
    catch (err) {
      return res.status(500).send({message:"Authentication Server Timedout!"});
    }
  }

  verifyAdmin = async (req, res, next) => {
    if (!req.session || !req.session.username) {
      return res.status(403).send({message:"No session found! Please login!"});
    }
    try {
      const authorization = await axios.post('http://127.0.0.1:8001/api/auth/verifyAdmin', { token: req.session.token });
      if (authorization.status === 200){
        next();
        return;
      } else{
        return res.status(403).send({message:"Token is invalid!"});
      }
    }
    catch (err) {
      return res.status(500).send({message:"Authentication Server Timedout!"});
    }
  }

  // Create a new question
  router.post("/", verifyAdmin, questions.create);

  // Retrieve all questions
  router.get("/all", verifySession, questions.findAll);

  // Retrieve a question using questionId
  router.get("/:questionId", verifySession, questions.findOne);

  // Retrieve a random question with complexity questionComplexity
  router.get("/random/:questionComplexity", questions.findRandomByComplexity);

  // Update a question using questionId
  router.put("/:questionId", verifyAdmin, questions.update);

  // Delete a question using questionId
  router.delete("/:questionId", verifyAdmin, questions.delete);

  // Delete all questions
  router.delete("/", verifyAdmin, questions.deleteAll);

  app.use('/question', router);
};