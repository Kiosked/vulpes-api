const VError = require("verror");
const { getLog } = require("../logging.js");

function handleError(err, req, res /*, next */) {
    const { code = null } = VError.info(err);
    const log = getLog(req);
    const outputError = (statusCode, status, message) => {
        log.warn({
            status: statusCode,
            code
        }, message);
        log.warn(err);
        res.status(statusCode).send(status);
    };
    // Reset content type for error
    res.set("Content-Type", "text/plain");
    switch (code) {
        case "vulpes/error/job-batch/dep-res":
            return outputError(400, "Bad Request", "Job batch dependencies could not be resolved");
        case "vulpes/error/job-batch/ids":
            return outputError(400, "Bad Request", "Job batch did not include necessary IDs");
        case "vulpes/error/job-batch/id-format":
            return outputError(400, "Bad Request", "Job batch IDs were of an invalid format");
        case "vulpes/error/job-batch/parent-res":
            return outputError(400, "Bad Request", "Job batch parent IDs were not resolveable");
        case "ERR_JOB_DATA_INVALID":
            return outputError(400, "Bad Request", "Request failed due to invalid job payload");
        default:
            log.warn(
                {
                    status: 500,
                    code
                },
                "Request failed due to an internal error"
            );
            log.error(err, "Server error during API request");
            res.status(500).send("Internal Server Error");
            break;
    }
}

module.exports = {
    handleError
};
