const express = require("express");
const AuthService = require("./auth-service");
const { requireAuth } = require("../middleware/jwt-auth");
const authRouter = express.Router();
const jsonBodyParser = express.json();
const path = require("path");

authRouter.post("/login", jsonBodyParser, (req, res, next) => {
  const { user_name, password } = req.body;
  const loginUser = {
    user_name,
    password
  };

  for (const [key, value] of Object.entries(loginUser)) {
    if (value === null) {
      return res.status(400).json({
        error: `Missing ${key} in request body`
      });
    }
  }

  AuthService.getUserWithUserName(req.app.get("db"), loginUser.user_name)
    .then(dbUser => {
      if (!dbUser) {
        return res.status(400).json({
          error: "Invalid user_name"
        });
      }
      return AuthService.comparePasswords(
        loginUser.password,
        dbUser.password
      ).then(compareMatch => {
        if (!compareMatch) {
          return res.status(400).json({
            error: "Incorrect password"
          });
        }
        const sub = dbUser.user_name;
        const payload = { user_id: dbUser.id };
        res.send({
          authToken: AuthService.createJwt(sub, payload)
        });
      });
    })
    .catch(next);
});

authRouter.post("/register", jsonBodyParser, (req, res, next) => {
  const { full_name, user_name, position, password } = req.body;
  for (const field of ["user_name", "full_name", "position", "password"]) {
    if (!req.body[field]) {
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });
    }
  }

  AuthService.hasUserWithUserName(
    req.app.get('db'),
    user_name
  )
    .then(hasUserWithUserName => {
      if (hasUserWithUserName)
        return res.status(400).json({ error: 'Username already exists'})
    })

  const passwordError = AuthService.validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ error: passwordError });
  }
  // Add check for username already in db
  return AuthService.hashPassword(password).then(hashedPassword => {
    const newUser = {
      user_name,
      password: hashedPassword,
      full_name,
      position
    };


    return AuthService.insertUser(req.app.get("db"), newUser).then(user => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${user.id}`))
        .json(AuthService.serializeUser(user));
    });
  });
});

authRouter
  .route("/users")
  .all(requireAuth)
  .get((req, res, next) => {
    AuthService.getAllUsers(req.app.get("db"))
      .then(users => res.json(users))
      .catch(next);
  });

authRouter
  .route("/user/:id")
  .all(requireAuth)
  .get((req, res, next) => {
    AuthService.getUserById(req.app.get("db"), req.params.id)
      .then(user => res.json(user))
      .catch(next);
  });

module.exports = authRouter;
