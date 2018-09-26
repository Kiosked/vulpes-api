const express = require("express");
const { createVulpesAPIRouter } = require("../source/index.js");

function createApp(service) {
    const app = express();
    const router = createVulpesAPIRouter(service);
    app.use("/", router);
    return app;
}

module.exports =  {
    createApp
};
