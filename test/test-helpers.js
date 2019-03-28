const bcrypt = require("bcryptjs");

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "jon",
      full_name: "Jon Snow",
      position: "doctor",
      password: "Password1234!"
    },
    {
      id: 2,
      user_name: "sansa",
      full_name: "Sansa Stark",
      position: "doctor",
      password: "Password1234!"
    },
    {
      id: 3,
      user_name: "arya",
      full_name: "Arya Stark",
      position: "doctor",
      password: "Password1234!"
    },
    {
      id: 4,
      user_name: "rob",
      full_name: "Rob Stark",
      position: "doctor",
      password: "Password1234!"
    }
  ];
}

function makeCardsArray(users) {
  return [
    {
      id: 1,
      surgeon: users[0].full_name,
      procedure: "Appendectomy",
      position: "Supine",
      glove_size: 7,
      glove_type: "small",
      dominant_hand: "right",
      equipment: "Electrosurgical unit with dispersive electrode",
      supplies: "Laparotomy pack",
      instrumentation: "Minor instrumentation set",
      suture_and_usage: "Ties: 2-0 Vicryl Reel",
      dressings: "Triple antibiotic ointment",
      skin_prep: "Shave if necessary",
      medications: "Bupivacaine",
      date_created: "2019-03-24T20:06:15.797Z",
      user_id: users[0].id
    },
    {
      id: 2,
      surgeon: users[1].full_name,
      procedure: "Spinal Fusion",
      position: "Supine",
      glove_size: 7,
      glove_type: "small",
      dominant_hand: "right",
      equipment: "Electrosurgical unit with dispersive electrode",
      supplies: "Laparotomy pack",
      instrumentation: "Minor instrumentation set",
      suture_and_usage: "Ties: 2-0 Vicryl Reel",
      dressings: "Triple antibiotic ointment",
      skin_prep: "Shave if necessary",
      medications: "Bupivacaine",
      date_created: "2019-03-24T20:06:15.797Z",
      user_id: users[1].id
    }
  ];
}

function makeCardsFixtures() {
  const testUsers = makeUsersArray();
  const testCards = makeCardsArray(testUsers);

  return { testUsers, testCards };
}

function makeExpectedCard(users, card) {
  const user = users.find(user => user.id === card.user_id);

  return {
    id: card.id,
    surgeon: card.surgeon,
    procedure: card.procedure,
    user_id: user.user_id,
    date_created: card.date_created,
    dominant_hand: card.dominant_hand,
    dressings: card.dressings,
    equipment: card.equipment,
    glove_size: card.glove_size,
    glove_type: card.glove_type,
    instrumentation: card.instrumentation,
    medications: card.medications,
    position: card.position,
    skin_prep: card.skin_prep,
    supplies: card.supplies,
    surgeon: card.surgeon,
    suture_and_usage: card.suture_and_usage
  };
}
function cleanTables(db) {
  return db.raw(
    `TRUNCATE
        prefcard_cards,
        prefcard_users`
  );
}
function seedUsers(db, users) {
  const testUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db.into("prefcard_users").insert(testUsers);
}
function seedTables(db, users, cards) {
  return seedUsers(db, users).then(() =>
    db.into("prefcard_cards").insert(cards)
  );
}
function makeMaliciousCard(user) {
  const maliciousCard = {
    date_created: "2019-03-24T20:06:15.797Z",
    dominant_hand: "right",
    dressings: "Triple antibiotic ointment",
    equipment: "Electrosurgical unit with dispersive electrode",
    glove_size: 7,
    glove_type: "small",
    id: 2,
    instrumentation: "Minor instrumentation set",
    medications: "Bupivacaine",
    position: "Supine",
    procedure: "Spinal Fusion",
    skin_prep: "Shave if necessary",
    supplies: "Laparotomy pack",
    surgeon: "Sansa Stark",
    suture_and_usage: "Ties: 2-0 Vicryl Reel",
    user_id: 2
  };
}
function makeMaliciousUser(user) {
  const maliciousUser = {
    id: 1,
    user_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    full_name: "Jon Snow",
    position: "doctor",
    password: "Password1234!"
  };
  const expectedUser = {
    id: 5,
    user_name: '&lt;script&gt;alert("xss");&lt;/script&gt;',
    full_name: "Jon Snow",
    position: "doctor",
    password: "Password1234!"
  };
  return {
    maliciousUser,
    expectedUser
  };
}
function seedMaliciousUser(db, maliciousUser) {
  return seedUsers(db, [maliciousUser]).then(() =>
    db.into("prefcard_users").insert([maliciousUser])
  );
}
function seedMaliciousCard(db, user, card) {
  return seedUsers(db, [user]).then(() => {
    db.into("prefcard_cards").insert([card]);
  });
}
module.exports = {
  makeUsersArray,
  makeCardsArray,
  makeCardsFixtures,
  cleanTables,
  seedTables,
  makeExpectedCard,
  makeMaliciousUser,
  seedMaliciousUser
};
