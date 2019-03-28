const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe('Users endpoints', () => {
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

  describe('GET /api/auth/users', () => {
    context('Given there is an xss attack in the user registration', () => {
        beforeEach('insert a malicious user', () => {
            const newTestUsers = [...testUsers]
            const newUser = {
                id: 5,
                user_name: '&lt;script&gt;alert("xss");&lt;/script&gt;',
                full_name: "Jon Snow",
                position: "doctor",
                password: "Password1234!"
              }
            newTestUsers.push(newUser)
            helpers.seedTables(db, newTestUsers, testCards);
            
        })
        it('responds with a sanitized user', () => {
            const { expectedUser } = helpers.makeMaliciousUser()
            return supertest(app)
                .get('/api/auth/users')
                .set('Authorization', token)
                .expect(200)
                .expect(res => {
                    expect(res.body[4].user_name).to.eql(expectedUser.user_name)
                })
        })
    
    })
    context('Given there are users in the database', () =>{
        it('responds with a users list', () => {
            
        })
    })
  })
})

