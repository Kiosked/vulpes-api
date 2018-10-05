const { Service } = require("vulpes");
const request = require("supertest");
const ms = require("ms");
const pkgInfo = require("../../package.json");
const { createApp } = require("../express.js");

describe("/status", function() {
    beforeEach(function() {
        this.service = new Service();
    });

    afterEach(function() {
        this.service.shutdown();
    });

    describe("when service is ready", function() {
        beforeEach(function() {
            return this.service.initialise();
        });

        it("responds with 'ok' status", function() {
            const earlierTime = Date.now() - ms("2m");
            return request(createApp(this.service))
                .get("/status")
                .set("Accept", "application/json")
                .expect(200)
                .then(response => {
                    expect(response.body).to.have.property("status", "ok");
                    expect(response.body)
                        .to.have.property("started")
                        .that.is.a("number")
                        .and.is.above(earlierTime);
                    expect(response.body).to.have.property("api", pkgInfo.version);
                });
        });
    });

    describe("when service has been shut down", function() {
        beforeEach(function() {
            return this.service.initialise().then(() => {
                this.service.shutdown();
            });
        });

        it("responds with 'offline' status", function() {
            const earlierTime = Date.now() - ms("2m");
            return request(createApp(this.service))
                .get("/status")
                .set("Accept", "application/json")
                .expect(200)
                .then(response => {
                    expect(response.body).to.have.property("status", "offline");
                    expect(response.body)
                        .to.have.property("started")
                        .that.is.a("number")
                        .and.is.above(earlierTime);
                    expect(response.body).to.have.property("api", pkgInfo.version);
                });
        });
    });

    describe("when service has not been initialised", function() {
        it("responds with 'init' status", function() {
            const earlierTime = Date.now() - ms("2m");
            return request(createApp(this.service))
                .get("/status")
                .set("Accept", "application/json")
                .expect(200)
                .then(response => {
                    expect(response.body).to.have.property("status", "init");
                    expect(response.body)
                        .to.have.property("started")
                        .that.is.a("number")
                        .and.is.above(earlierTime);
                    expect(response.body).to.have.property("api", pkgInfo.version);
                });
        });
    });
});
