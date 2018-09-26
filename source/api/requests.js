const { getLog } = require("../logging.js");

function logRequests(req, res, next) {
    const log = getLog(req);
    log.info(
        {
            method: req.method,
            url: req.originalUrl
        },
        "New request"
    );
    next();
}

module.exports = {
    logRequests
};
