const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");

verifyToken = (req,res,next) => {
    console.log("Authenticating with verifyToken.")
    console.log("Request headers:");
    console.log(req.headers);
    console.log("Request body:");
    console.log(req.body);
    let token = req.session.token || req.headers.cookie; // req.session.token used if called locally from user-service
    if (!token) {
        console.log("No token found.");
        return res.status(403).send({ message: "No token provided." });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            console.log(err.message);
            return res.status(401).send({ message: "Authorization failed." });
        }
        if (req.session.token) {
            req.userId = decoded.id; // set userId for delete/update user
        }
        console.log("Authorization success.");
        return res.status(200).send({ message: "Authorization succeeded." });
    });
};


isAdmin = (req,res,next) => {
    console.log("Authenticating with verifyAdmin.")
    console.log("Request headers:");
    console.log(req.headers);
    console.log("Request body:");
    console.log(req.body);
    let token = req.session.token || req.headers.cookie; // req.session.token used if called locally from user-service
    if (!token) {
        console.log("No token found.");
        return res.status(403).send({ message: "No token provided." });
    }
    jwt.verify(token, config.secret, (err,decoded) => {
        if (err) {
            console.log(err.message);
            return res.status(401).send({ message: "Authorization failed." });
        }
        if (decoded.isAdmin) {
            if (!req.session.token) {
                req.userId = decoded.id;
            }
            console.log("Admin authorization success.");
            return res.status(200).send({ message: "Admin authorization succeeded." });
        }
        console.log("No admin authorization. Forbidden.");
        return res.status(403).send({ message: "Admin authorization needed. Forbidden." });
    });
};


const authJwt = {
    verifyToken,
    isAdmin,
}; 
module.exports = authJwt;
