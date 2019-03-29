const express = require("express");
const CardsService = require("./cards-service");
const { requireAuth } = require("../middleware/jwt-auth");
const jsonBodyParser = express.json()
const AuthService = require('../auth/auth-service')

const cardsRouter = express.Router();

cardsRouter
  .route("/all")
  .all(requireAuth)
  .get((req, res, next) => {
    CardsService.getAllCards(req.app.get("db"))
      .then(cards => {
        res.json(cards);
      })
      .catch(next);
  });
cardsRouter
  .route("/:id")
  .all(requireAuth)
  .get((req, res, next) => {
    CardsService.getCardById(req.app.get("db"), req.params.id).then(data =>
      res.json(data)
    );
  });
cardsRouter
    .route("/create-card")
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
  const {
    surgeon,
    procedure,
    position,
    glove_size,
    glove_type,
    dominant_hand,
    equipment,
    supplies,
    instrumentation,
    suture_and_usage,
    dressings,
    skin_prep,
    medications,
    user_id
  } = req.body;
  const newCard = {
    surgeon,
    procedure,
    position,
    glove_size: parseInt(glove_size),
    glove_type,
    dominant_hand,
    equipment,
    supplies,
    instrumentation,
    suture_and_usage,
    dressings,
    skin_prep,
    medications,
    user_id
  }
  for (const [key, value] of Object.entries(newCard))
  if (value == null)
    return res.status(400).json({
      error: `Missing '${key}' in request body`
    })

    CardsService.insertCard(
        req.app.get('db'),
        newCard
    )
        .then(card => {
            res
                .status(201)
                .json(AuthService.serializeCard(card))
        })

});
cardsRouter
    .route('/:id')
    .patch(requireAuth, jsonBodyParser, (req, res, next) => {
        const {
            surgeon,
            procedure,
            position,
            glove_size,
            glove_type,
            dominant_hand,
            equipment,
            supplies,
            instrumentation,
            suture_and_usage,
            dressings,
            skin_prep,
            medications,
            user_id
          } = req.body;
          const updatedObj = {
            surgeon,
            procedure,
            position,
            glove_size,
            glove_type,
            dominant_hand,
            equipment,
            supplies,
            instrumentation,
            suture_and_usage,
            dressings,
            skin_prep,
            medications,
            user_id
          }
          CardsService.updateCards(req.app.get('db'), req.params.id, updatedObj)
          .then(card => {
            res
                .status(200)
                .json(card)
        })

    })
cardsRouter
    .route('/:id')
    .delete(requireAuth, (req, res, next) => {
      CardsService.deleteCard(req.app.get('db'), req.params.id)
      .then(() => res.status(200).send('deleted'))
    })
module.exports = cardsRouter;
