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
        case "ERR_JOB_DATA_INVALID":
            return outputError(400, "Bad Request", "Request failed due to invalid payload");
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
