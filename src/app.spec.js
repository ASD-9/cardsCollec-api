const request = require("supertest");
const app = require("./app");

let server;

describe("APP should say 'Bonjour Monde!'", () => {
  beforeAll(() => {
    server = app;
  });

  it("should return 200", (done) => {
    request(server)
      .get("/")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({"message": "Bonjour Monde!"});
        done();
      })
  });
})
