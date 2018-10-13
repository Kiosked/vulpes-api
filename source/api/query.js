const VError = require("verror");
const { getLog } = require("../logging.js");
const { mapSmartQueryParameters } = require("../query.js");

function handleJobsQuery(req, res) {
    const { __service: service } = req;
    const log = getLog(req);
    return Promise.resolve()
        .then(() => {
            const { query, options = {} } = req.body;
            if (!query || typeof query !== "object") {
                throw new VError(
                    { info: { code: "ERR_JOB_QUERY_INVALID" } },
                    "Invalid jobs query object"
                );
            } else if (options && typeof options !== "object") {
                throw new VError(
                    { info: { code: "ERR_JOB_QUERY_OPTS_INVALID" } },
                    "Invalid jobs query options object"
                );
            }
            if (options.limit === -1) {
                options.limit = Infinity;
            }
            log.info({ query, options }, "Performing jobs query");
            const finalQuery = mapSmartQueryParameters(query);
            return service.queryJobs(finalQuery, options);
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
