const { Service } = require("vulpes");
const request = require("supertest");
const ms = require("ms");
const pkgInfo = require("../../package.json");
const { createApp } = require("../express.js");

const UUID_REXP = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

describe("/jobs", function() {
    beforeEach(function() {
        this.service = new Service();
        return this.service.initialise();
    });

    afterEach(function() {
        this.service.shutdown();
    });

    describe("POST", function() {
        it("creates jobs", function() {
            return request(createApp(this.service))
                .post("/jobs")
                .send({
                    jobs: [
                        { id: 1, type: "jobtype1" },
                        { id: 2, type: "jobtype2" }
                    ]
                })
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .expect(200)
                .then(response => {
                    expect(response.body).to.have.property("jobs").that.is.an("array");
                    const { jobs } = response.body;
                    expect(jobs.find(job => job.type === "jobtype1")).to.have.property("id").that.matches(UUID_REXP);
                    expect(jobs.find(job => job.type === "jobtype2")).to.have.property("id").that.matches(UUID_REXP);
                });
        });

        it("returns 400 if no jobs provided", function() {
            return request(createApp(this.service))
                .post("/jobs")
                .send({})
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .expect(400);
        });

        it("returns 400 if no job IDs provided", function() {
            return request(createApp(this.service))
                .post("/jobs")
                .send({
                    jobs: [
                        { type: "jobtype1" },
                        { type: "jobtype2" }
                    ]
                })
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .expect(400);
        });
    });
});
