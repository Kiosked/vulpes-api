const VError = require("verror");
const { getLog } = require("../logging.js");

function handleError(err, req, res /*, next */) {
    const { code } = VError.info(err);
    const log = getLog(req);
    switch (code) {
        default:
            log.warn(
                {
                    status: 500,
                    code: code || null
                },
                "Request failed due to an internal error"
            );
            log.error(err, "Server error during API request");
            res.status(500).send("Internal server error");
            break;
    }
}

module.exports = {
    handleError
};
