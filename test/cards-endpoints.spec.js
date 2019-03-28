const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Cards Endpoints", () => {
  let db;

  const { testUsers, testCards } = helpers.makeCardsFixtures();
  
  const token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE1NTM3OTQ4MjIsInN1YiI6InNhbnNhIn0.PVaZrgRZ945dBCp2VzeTjhgqG36nKymuw6kBvuQ9hwA";
  before("Make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });
  after("disconnect from db", () => db.destroy());
  before("cleanup", () => helpers.cleanTables(db));
  afterEach("cleanup", () => helpers.cleanTables(db));

  describe("GET /api/all", () => {
    context("Given no cards", () => {
      beforeEach("insert users", () => {
        helpers.seedTables(db, testUsers);
      });
      it("responds with 200 and empty array", () => {
        return supertest(app)
          .get("/api/all")
          .set("Authorization", token)
          .expect(200, []);
      });
    });

    context("Given there are cards and users in the db", () => {
      beforeEach("insert cards and users", () => {
        helpers.seedTables(db, testUsers, testCards);
      });
      it("responds with 200 and all cards", () => {
        const expectedCards = [
          {
            date_created: "2019-03-24T20:06:15.797Z",
            dominant_hand: "right",
            dressings: "Triple antibiotic ointment",
            equipment: "Electrosurgical unit with dispersive electrode",
            glove_size: 7,
            glove_type: "small",
            id: 1,
            instrumentation: "Minor instrumentation set",
            medications: "Bupivacaine",
            position: "Supine",
            procedure: "Appendectomy",
            skin_prep: "Shave if necessary",
            supplies: "Laparotomy pack",
            surgeon: "Jon Snow",
            suture_and_usage: "Ties: 2-0 Vicryl Reel",
            user_id: 1
          },
          {
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
          }
        ];
        return supertest(app)
          .get("/api/all")
          .set("Authorization", token)
          .expect(200, expectedCards);
      });
    });
  });
});
