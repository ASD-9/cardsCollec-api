const request = require("supertest");
const app = require("./app");

describe("APP should say 'Bonjour Monde!'", () => {
  it("should return 200", (done) => {
    request(app)
      .get("/")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({"message": "Bonjour Monde!"});
        done();
      })
  });
})
