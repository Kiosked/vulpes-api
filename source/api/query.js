const VError = require("verror");
const { getLog } = require("../logging.js");
const { mapSmartQueryParameters } = require("../query.js");

function handleJobsQuery(req, res) {
    const { __service: service } = req;
    const log = getLog(req);
    return Promise.resolve()
        .then(() => {
            const { query } = req.body;
            if (!query || typeof query !== "object") {
                throw new VError(
                    { info: { code: "ERR_JOB_QUERY_INVALID" } },
                    "Invalid jobs query object"
                );
            }
            log.info({ query }, "Performing jobs query");
            const finalQuery = mapSmartQueryParameters(query);
            return service.queryJobs(finalQuery);
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
    handleJobsQuery
};
