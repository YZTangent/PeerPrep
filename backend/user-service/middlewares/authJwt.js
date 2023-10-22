const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");

verifyToken = (req,res,next) => {
    console.log(req.headers);
    console.log("hello from verifyToken!");
    let token = req.body.token || req.session.token; //Uses req.session.token if its called locally from user-service
    if (!token) {
        return res.status(403).send({message:"No token provided!"});
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) {
            return res.status(401).send({message:"Authorization Failed!"});
        }
        if (req.session.token) {
            req.userId = decoded.id; // set userId for delete/update user
            next();
            return;
        }
        return res.status(200).send({message:"Authorized!"});
    });
};


isAdmin = (req,res,next) => {
    console.log(req.headers);
    console.log("hello from verifyAdmin!");
    let token = req.body.token || req.session.token; //Uses req.session.token if its called locally from user-service
    if (!token) {
        console.log("no token!");
        return res.status(403).send({message:"No token provided!"});
    }
    jwt.verify(token, config.secret, (err,decoded) => {
        if(err) {
            console.log("no verify!");
            return res.status(401).send({message:"Authorization Failed!"});
        }
        if(decoded.isAdmin) {
            if (!req.session.token) {
                req.userId = decoded.id;
                next();
                return;
            }
            return res.status(200).send({message:"Authorized!"});
        }
        console.log("no admin!");
        return res.status(403).send({message:"Only admins can do this!"});
    });
};


const authJwt = {
    verifyToken,
    isAdmin,
}; 
module.exports = authJwt;
