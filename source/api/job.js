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
        .then(jobID => {
            log.info(
                {
                    jobID
                },
                "Added job"
            );
            res.send(
                JSON.stringify({ jobID })
            );
        });
}

module.exports = {
    handleJobCreation
};
