const { verifySignUp } = require("../middlewares");
const {authJwt} = require("../middlewares");

const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/signout", controller.signout);
  app.post("/api/auth/verify", [authJwt.verifyToken]);
  app.post("/api/auth/verifyAdmin", [authJwt.isAdmin]);
};