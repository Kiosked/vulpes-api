const pkgInfo = require("../../package.json");

const STARTED = Date.now();

function handleStatus(req, res) {
    const { __service: service } = req;
    let status = "ok";
    if (!service.alive) {
        status = "offline";
    } else if (service.alive && !service.initialised) {
        status = "init";
    }
    res.send(JSON.stringify({
        status,
        api: pkgInfo.version,
        started: STARTED
    }));
}

module.exports = {
    handleStatus
};
