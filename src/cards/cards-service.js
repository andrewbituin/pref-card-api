const CardsService = {
  getAllCards(db) {
    return db.from("prefcard_cards AS pc").select("*");
  },
  getCardById(db, id) {
    return db
      .from("prefcard_cards AS pc")
      .where("pc.id", id)
      .first();
  },
  insertCard(db, newCard) {
    return db
      .insert(newCard)
      .into("prefcard_cards")
      .returning("*")
      .then(([card]) => card)
      .then(card => CardsService.getCardById(db, card.id));
  },
  updateCards(db, id, updatedCard) {
    return db("prefcard_cards")
      .update(updatedCard)
      .where("id", id)
      .returning("*")
      .then(([card]) => card)
      .then(card => CardsService.getCardById(db, card.id));
  },
  deleteCard(db, id) {
    return db("prefcard_cards")
      .where("id", id)
      .del()
      .returning("*");
  }
};
module.exports = CardsService;
