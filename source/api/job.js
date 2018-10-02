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
            res.send(
                JSON.stringify({ job })
            );
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

module.exports = {
    handleJobCreation,
    handleJobsCreation
};
