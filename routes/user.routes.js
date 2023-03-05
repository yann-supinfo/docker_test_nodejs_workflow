const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);


  
  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.put(
    "/api/test/user/update/password",
    [authJwt.verifyToken],
    controller.userUpdatePassword
  );


  app.put(
    "/api/test/user/update/profil",
    [authJwt.verifyToken],
    controller.userUpdateProfil
  );

  app.delete(
    "/api/test/user/delete",
    [authJwt.verifyToken],
    controller.userDelete
  );

  app.get(
    "/api/test/user/:id",
    [authJwt.verifyToken],
    controller.findById
  );

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};