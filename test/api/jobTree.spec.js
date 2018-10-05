const { Service } = require("vulpes");
const request = require("supertest");
const ms = require("ms");
const uuid = require("uuid/v4");
const pkgInfo = require("../../package.json");
const { createApp } = require("../express.js");

const UUID_REXP = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

describe("/job-tree/:id", function() {
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

    describe("GET", function() {
        it("returns all connected jobs", function() {
            return request(createApp(this.service))
                .get(`/job-tree/${this.targetID}`)
                .set("Accept", "application/json")
                .expect(200)
                .then(response => {
                    expect(response.body).to.have.property("jobs").that.is.an("array");
                    const { jobs } = response.body;
                    expect(jobs).to.have.lengthOf(4);
                });
        });

        it("returns empty array if the job ID doesn't exist", function() {
            return request(createApp(this.service))
                .get(`/job-tree/${uuid()}`)
                .set("Accept", "application/json")
                .expect(200)
                .then(response => {
                    expect(response.body).to.have.property("jobs").that.is.an("array");
                    expect(response.body.jobs).to.have.lengthOf(0);
                });
        });
    });
});
