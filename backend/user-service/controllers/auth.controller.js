const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save().then((user) => {
    if (req.body.roles) {
        Role.find({name: { $in: req.body.roles }}).then((roles) => {
            user.roles = roles.map(role => role._id);
            user.save().then(() => {
                res.send({ message: "User was registered successfully!" });
            }).catch((err) => { res.status(500).send({ message: err }); });
        }).catch((err) => { res.status(500).send({ message: err }); })
    } else {    
        Role.findOne({ name: "user" }).then((role) => {
            user.roles = [role._id];
            user.save().then(() => {
                res.send({ message: "User was registered successfully!" });
            }).catch((err) => { res.status(500).send({ message: err });})})
            .catch((err) => { res.status(500).send({ message: err }); });
        }
})
    .catch((err) => {
        res.status(500).send({ message: err.message });
    })
;};

exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username
    })
        .populate("roles", "-__v")
        .exec().then((user) => {  
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    message: "Invalid Credentials!"
                });
            }
            var authorities = [];
            let isAdmin = false;
            for (let i = 0; i < user.roles.length; i++) {
                if (user.roles[i].name.toUpperCase() === "ADMIN") {
                    isAdmin = true;
                }
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }

            const token = jwt.sign({ id: user.id, isAdmin: isAdmin }, config.secret, {
                algorithm: "HS256",
                allowInsecureKeySizes: true,
                expiresIn: 86400 // 24 hours
            });

        req.session.token = token;
        req.session.username = user.username;
        req.session.authorities = authorities;
        res.status(200).send({
            token: token,
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
        });
    })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};

exports.signout = (req, res) => {
    try {
        req.session = null;
        return res.status(200).send({ message: "You've been signed out!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};