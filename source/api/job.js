const VError = require("verror");
const { getLog } = require("../logging.js");

function handleJobCreation(req, res) {
    const { __service: service } = req;
    const log = getLog(req);
    return Promise.resolve()
        .then(() => {
            const { job } = req.body;
            if (!job || typeof job !== "object") {
                throw new VError(
                    { info: { code: "ERR_JOB_DATA_INVALID" } },
                    "Invalid job data for new job request"
                );
            }
            log.info(job, "Adding job");
            return service.addJob(job);
        })
        .then(jobID => service.getJob(jobID))
        .then(job => {
            log.info(
                {
                    jobID: job.id
                },
                "Added job"
            );
            res.send(JSON.stringify({ job }));
        });
}

function handleJobsCreation(req, res) {
    const { __service: service } = req;
    const log = getLog(req);
    return Promise.resolve()
        .then(() => {
            const { jobs } = req.body;
            if (!jobs || !Array.isArray(jobs)) {
                throw new VError(
                    { info: { code: "ERR_JOB_DATA_INVALID" } },
                    "Invalid job data for new job request"
                );
            }
            log.info({ jobs }, "Adding jobs");
            return service.addJobs(jobs);
        })
        .then(jobs => {
            log.info(
                {
                    jobs: jobs.map(job => job.id)
                },
                "Added jobs"
            );
            res.send(
                JSON.stringify({
                    jobs
                })
            );
        });
}

function handleJobFetch(req, res) {
    const { __service: service } = req;
    const log = getLog(req);
    return Promise.resolve()
        .then(() => {
            const { jobid: jobID } = req.params;
            if (!jobID || typeof jobID !== "string") {
                throw new VError(
                    { info: { code: "ERR_JOB_ID_INVALID" } },
                    "Invalid job ID for job data request"
                );
            }
            log.info({ jobID }, "Fetching job");
            return service.getJob(jobID);
        })
        .then(job => {
            if (!job) {
                const { jobid: jobID } = req.params;
                log.info({ jobID }, "No job found for ID");
                throw new VError(
                    { info: { code: "ERR_JOB_NOT_FOUND" } },
                    `No job found for ID: ${jobID}`
                );
            }
            res.send(
                JSON.stringify({
                    job
                })
            );
        });
}

function handleJobReset(req, res) {
    const { __service: service } = req;
    const log = getLog(req);
    return Promise.resolve()
        .then(() => {
            const { jobid: jobID } = req.params;
            if (!jobID || typeof jobID !== "string") {
                throw new VError(
                    { info: { code: "ERR_JOB_ID_INVALID" } },
                    "Invalid job ID for job reset request"
                );
            }
            log.info({ jobID }, "Resetting job");
            return service.resetJob(jobID).then(() => jobID);
        })
        .then(jobID => {
            log.info({ jobID }, "Reset job");
            res.send(JSON.stringify({ jobID }));
        });
}

function handleJobResult(req, res) {
    const { __service: service } = req;
    const log = getLog(req);
    return Promise.resolve()
        .then(() => {
            const { jobid: jobID } = req.params;
            const { type, data } = req.body;
            log.info({ jobID, resultType: type, resultData: data }, "Applying job result");
            return service.stopJob(jobID, type, data);
        })
        .then(() => {
            const { jobid: jobID } = req.params;
            log.info({ jobID }, "Applied job result");
            res.send(
                JSON.stringify({
                    jobID
                })
            );
        });
}

function handleNextJob(req, res) {
    const { __service: service } = req;
    const log = getLog(req);
    return Promise.resolve()
        .then(() => {
            log.info("Fetching work");
            return service.startJob();
        })
        .then(nextJob => {
            if (nextJob === null) {
                log.info("No job available to start");
            } else {
                log.info({ jobID: nextJob.id }, "Started work on job");
            }
            res.send(
                JSON.stringify({
                    job: nextJob || null
                })
            );
        });
}

module.exports = {
    handleJobCreation,
    handleJobsCreation,
    handleJobFetch,
    handleJobReset,
    handleJobResult,
    handleNextJob
};
