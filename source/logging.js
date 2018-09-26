const DEFAULT_LOG_HANDLER = Object.freeze({
    error: () => {},
    info: () => {},
    warn: () => {}
});
const LOG_PROPERTY = "@@vulpesAPILog";

function attachLogHandler(router, handler) {
    router.use((req, res, next) => {
        req[LOG_PROPERTY] = handler;
        next();
    });
}

function getLog(req) {
    return req[LOG_PROPERTY];
}

module.exports = {
    DEFAULT_LOG_HANDLER,
    attachLogHandler,
    getLog
};
