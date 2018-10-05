const VError = require("verror");
const { getLog } = require("../logging.js");

function handleJobTreeFetch(req, res) {
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
            log.info({ jobID }, "Fetching job tree");
            return service.getJobTree(jobID);
        })
        .then(jobs => {
            res.send(
                JSON.stringify({
                    jobs
                })
            );
        });
}

module.exports = {
    handleJobTreeFetch
};
