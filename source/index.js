const createRouter = require("express-promise-router");
const { createRoutes } = require("./routes.js");
const { DEFAULT_LOG_HANDLER, attachLogHandler } = require("./logging.js");

/**
 * Create an Express Router instance for use with an express app
 * @param {Vulpes.Service} vulpesService The Vulpes service to create the app for
 * @returns {Express.Router} An express router, built using the
 *  express-promise-router library
 * @example
 *  const router = createVulpesAPIRouter(service);
 *  app.use("/", router);
 * @see https://www.npmjs.com/package/express-promise-router
 * @see https://expressjs.com/en/guide/routing.html#express-router
 */
function createVulpesAPIRouter(vulpesService, { log: DEFAULT_LOG_HANDLER } = {}) {
    const router = createRouter();
    attachLogHandler(router, log);
    createRoutes(router, vulpesService);
    return router;
}

module.exports = {
    createVulpesAPIRouter
};
