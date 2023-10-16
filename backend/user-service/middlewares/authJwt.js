const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");
const User = db.user;
const Role = db.role;

verifyToken = (req,res,next) => {
    let token = req.session.token;

    if (!token) {
        return res.status(403).send({message:"No token provided!"});
    }
    
    jwt.verify(token, config.secret, (err,decoded) => {
        if(err) {
            return res.status(401).send({message:"sir stop sir, u are unauthorized!"});
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req,res,next) => {
    User.findById(req.userId).exec().then((user) => {
        Role.find({_id:{$in:user.roles}}).then((roles) => {
            for(let i=0; i<roles.length; i++) {
                if(roles[i].name === "admin") {
                    next();
                    return;
                }
            }
            res.status(403).send({message:"sir stop sir, you require admin role!"});
            return;
        }).catch((err) => { res.status(500).send({message:err});});
    }).catch((err) => { res.status(500).send({message:err});});
};

const authJwt = {
    verifyToken,
    isAdmin
}; 
module.exports = authJwt;