const { Service } = require("vulpes");
const request = require("supertest");
const ms = require("ms");
const uuid = require("uuid/v4");
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

describe("/job/:id", function() {
    beforeEach(function() {
        this.service = new Service();
        return this.service
            .initialise()
            .then(() => this.service.addJob({
                type: "testjob"
            }))
            .then(jobID => {
                this.jobID = jobID;
            });
    });

    afterEach(function() {
        this.service.shutdown();
    });

    describe("GET", function() {
        it("returns the job", function() {
            return request(createApp(this.service))
                .get(`/job/${this.jobID}`)
                .set("Accept", "application/json")
                .expect(200)
                .then(response => {
                    expect(response.body).to.have.property("job").that.is.an("object");
                    const { job } = response.body;
                    expect(job).to.have.property("id", this.jobID);
                    expect(job).to.have.property("type", "testjob");
                });
        });

        it("returns 404 if the ID doesn't exist", function() {
            return request(createApp(this.service))
                .get(`/job/${uuid()}`)
                .set("Accept", "application/json")
                .expect(404);
        });
    });
});

describe("/job/:jobid/reset", function() {
    beforeEach(function() {
        this.service = new Service();
        return this.service
            .initialise()
            .then(() => this.service.addJob({
                type: "testjob"
            }))
            .then(jobID => {
                this.jobID = jobID;
                return this.service.startJob(this.jobID);
            });
    });

    afterEach(function() {
        this.service.shutdown();
    });

    it("resets job statuses", function() {
        return this.service.stopJob(this.jobID, Service.JobResult.Failure)
            .then(() => request(createApp(this.service))
                .get(`/job/${this.jobID}/reset`)
                .set("Accept", "application/json")
                .expect(200)
            )
            .then(response => {
                expect(response.body).to.have.property("jobID").that.equals(this.jobID);
                return this.service.getJob(this.jobID);
            })
            .then(job => {
                expect(job.status).to.equal(Service.JobStatus.Pending);
            });
    });

    it("returns 409 if job not stopped", function() {
        return request(createApp(this.service))
            .get(`/job/${this.jobID}/reset`)
            .set("Accept", "application/json")
            .expect(409);
    });

    it("returns 409 if job has succeeded", function() {
        return this.service.stopJob(this.jobID, Service.JobResult.Success)
            .then(() => request(createApp(this.service))
                .get(`/job/${this.jobID}/reset`)
                .set("Accept", "application/json")
                .expect(409)
            );
    });
});
