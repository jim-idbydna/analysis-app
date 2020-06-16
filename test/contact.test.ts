import request from "supertest";
import app from "../src/app";
import { expect} from "chai";

describe("GET /analyses", () => {
    it("should return 200 OK", (done) => {
        request(app).get("/analyses")
            .expect(200, done);
    });
});


describe("POST /analyses", () => {
    it("should return false from assert when no message is found", (done) => {
        request(app).post("/analyses")
            .field("name", "John Doe")
            .field("email", "john@me.com")
            .end(function(err, res) {
                expect(res.error).to.be.false;
                done();
            })
            .expect(302);

    });
});