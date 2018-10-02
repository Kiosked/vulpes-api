const path = require("path");
const express = require("express");
const enableCORS = require("cors");
const bodyParser = require("body-parser");
const { logRequests } = require("./api/requests.js");
const { handleError } = require("./api/errors.js");
const { handleStatus } = require("./api/status.js");
const { handleJobCreation, handleJobsCreation } = require("./api/job.js");

function createRoutes(router, service, { cors = true, parseJSON = true } = {}) {
    // Initialisation
    if (cors) {
        router.use(enableCORS({
            origin: true
        }));
    } else {
        router.use(enableCORS({
            origin: false
        }));
    }
    if (parseJSON) {
        router.use(bodyParser.json());
    }
    // Attach service
    router.use((req, res, next) => {
        req.__service = service;
        res.set("Content-Type", "application/json");
        next();
    });
    // Log request info
    router.use(logRequests);
    // Setup routes
    router.route("/status").get(handleStatus);
    router.route("/job").post(handleJobCreation);
    router.route("/jobs").post(handleJobsCreation);
    // router.route("/job/:jobid").get(handleJobFetch);
    // router.route("/job/:jobid/reset").get(handleJobReset);
    // router
    //     .route("/job/:jobid/result")
    //     .put(handleJobResultOverwritten)
    //     .patch(handleJobResultMerged);
    // router.route("/job-tree/:jobid").get(handleJobTreeFetch);
    // router.route("/query/jobs").post(handleJobsQuery);
    // router.route("/work").get(handleNextJob);
    // Attach error handler
    router.use((err, req, res, next) => handleError(err, req, res, next));
}

module.exports = {
    createRoutes
};
