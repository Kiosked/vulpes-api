const { Service } = require("vulpes");
const request = require("supertest");
const uuid = require("uuid/v4");
const { createApp } = require("../express.js");

describe("/worker/register", function() {
    beforeEach(function() {
        this.service = new Service();
        return this.service.initialise();
    });

    afterEach(function() {
        this.service.shutdown();
    });

    describe("POST", function() {
        it("registers workers", function() {
            const id = uuid();
            return request(createApp(this.service))
                .post("/worker/register")
                .send({ id })
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .expect(200)
                .then(() => {
                    expect(this.service.tracker.liveWorkers).to.have.a.lengthOf(1);
                });
        });
    });
});
