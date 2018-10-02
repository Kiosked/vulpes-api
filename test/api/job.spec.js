const { Service } = require("vulpes");
const request = require("supertest");
const ms = require("ms");
const pkgInfo = require("../../package.json");
const { createApp } = require("../express.js");

const UUID_REXP = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

describe("/job", function() {
    beforeEach(function() {
        this.service = new Service();
        return this.service.initialise();
    });

    afterEach(function() {
        this.service.shutdown();
    });

    describe("POST", function() {
        it("creates a job", function() {
            return request(createApp(this.service))
                .post("/job")
                .send({
                    job: {
                        type: "test1",
                        data: {
                            value: 42,
                            reason: "because"
                        }
                    }
                })
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .expect(200)
                .then(response => {
                    expect(response.body).to.have.property("job").that.is.an("object");
                    const { job } = response.body;
                    expect(job).to.have.property("type", "test1");
                    expect(job).to.have.property("data").that.deep.equals({
                        value: 42,
                        reason: "because"
                    });
                });
        });

        it("returns 400 if no job provided", function() {
            return request(createApp(this.service))
                .post("/job")
                .send({})
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .expect(400);
        });
    });
});
