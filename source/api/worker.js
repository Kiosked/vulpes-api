const { getLog } = require("../logging.js");

function handleWorkerRegistration(req, res) {
    const { __service: service } = req;
    const log = getLog(req);
    return Promise.resolve().then(() => {
        const { id } = req.body;
        if (!id) {
            throw new VError(
                { info: { code: "ERR_WORKER_ID_INVALID" } },
                "Invalid worker ID for worker registration"
            );
        }
        log.info({ workerID: id }, "Registering worker");
        service.tracker.registerWorker(id);
        res.send(JSON.stringify({}));
    });
}

module.exports = {
    handleWorkerRegistration
};
