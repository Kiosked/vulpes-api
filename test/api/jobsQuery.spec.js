const { Service } = require("vulpes");
const request = require("supertest");
const ms = require("ms");
const uuid = require("uuid/v4");
const pkgInfo = require("../../package.json");
const { createApp } = require("../express.js");

const UUID_REXP = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

describe("/query/jobs", function() {
    beforeEach(function() {
        this.service = new Service();
        return this.service
            .initialise()
            .then(() => this.service.addJobs([
                { id: 1, type: "parent1" },
                { id: 2, type: "parent2" },
                { id: 3, parents: [1, 2], type: "target" },
                { id: 4, parents: [3], type: "child" }
            ]))
            .then(jobs => {
                this.jobs = jobs;
                this.targetID = jobs.find(job => job.type === "target").id;
            });
    });

    afterEach(function() {
        this.service.shutdown();
    });

    describe("POST", function() {
        it("returns job results", function() {
            return request(createApp(this.service))
                .post("/query/jobs")
                .send({
                    query: {
                        type: "target"
                    }
                })
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .expect(200)
                .then(response => {
                    expect(response.body).to.have.property("jobs").that.is.an("array");
                    const { jobs } = response.body;
                    expect(jobs).to.have.lengthOf(1);
                });
        });

        it("supports regular expressions", function() {
            return request(createApp(this.service))
                .post("/query/jobs")
                .send({
                    query: {
                        type: {
                            type: "regex",
                            value: "^PARENT",
                            modifier: "i"
                        }
                    }
                })
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .expect(200)
                .then(response => {
                    const { jobs } = response.body;
                    expect(jobs).to.have.lengthOf(2);
                    expect(jobs.find(job => job.type === "parent1")).to.be.an("object");
                    expect(jobs.find(job => job.type === "parent2")).to.be.an("object");
                });
        });
    });
});
