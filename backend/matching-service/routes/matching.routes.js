const { default: axios } = require("axios");

module.exports = app => {
    const matching = require("../controllers/matching.controller.js");
  
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

    // Enqueue a new match
    router.post("/enqueue", verifySession, matching.enqueue);
  
    // Dequeue an existing match
    router.post("/dequeue", verifySession, matching.dequeue);
    
    // Get current Queue 
    router.get("/getLength", matching.getLength);
  
    app.use('/matching', router);
  };