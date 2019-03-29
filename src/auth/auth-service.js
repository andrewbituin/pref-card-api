const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const xss = require("xss");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;
const AuthService = {
  parseBasicToken(bearerToken) {
    return Buffer.from(bearerToken, "base64")
      .toString()
      .split(":");
  },
  getUserWithUserName(db, user_name) {
    return db("prefcard_users")
      .where({ user_name })
      .first();
  },
  getUserById(db, id) {
    return db("prefcard_users")
      .where({ id })
      .first();
  },
  hasUserWithUserName(db, user_name) {
    return db("prefcard_users")
      .where({ user_name })
      .first()
      .then(user => !!user);
  },
  getAllUsers(db) {
    return db("prefcard_users").select(
      "id",
      "user_name",
      "full_name",
      "position"
    );
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: "HS256"
    });
  },
  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ["HS256"]
    });
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into("prefcard_users")
      .returning("*")
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return "Password must be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password must be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain 1 upper case, lower case, number and special character";
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(user) {
    return {
      id: xss(user.id),
      full_name: xss(user.full_name),
      user_name: xss(user.user_name),
      date_create: new Date(user.date_created)
    };
  },
  serializeCard(card) {
    return {
      surgeon: xss(card.surgeon),
      procedure: xss(card.procedure),
      position: xss(card.position),
      glove_size: parseInt(card.glove_size),
      glove_type: xss(card.glove_type),
      dominant_hand: xss(card.dominant_hand),
      equipment: xss(card.equipment),
      supplies: xss(card.supplies),
      instrumentation: xss(card.instrumentation),
      suture_and_usage: xss(card.suture_and_usage),
      dressings: xss(card.dressings),
      skin_prep: xss(card.skin_prep),
      medications: xss(card.medications),
      user_id: xss(card.user_id)
    };
  }
};

module.exports = AuthService;
