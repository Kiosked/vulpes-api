# Vulpes-API
> API generator for the Vulpes job management framework

[![Build Status](https://travis-ci.org/Kiosked/vulpes-api.svg?branch=master)](https://travis-ci.org/Kiosked/vulpes-api)

## About
[Vulpes](https://github.com/Kiosked/vulpes) is a NodeJS job management framework, designed to provide a solid base to build **automation** projects upon. This library provides an interface that exports an ExpressJS API (Router) that can be used to instantly provide an API endpoint for your job management platform.

## Installation
Install by running `npm install vulpes-api --save`. Vulpes-API depends on `vulpes` as a peer dependency, so you must have that installed as well.

## Usage
Usage is quite simple - assuming that you have an existing ExpressJS setup:

```javascript
const express = require("express");
const { Service } = require("vulpes");
const { createVulpesAPIRouter } = require("vulpes-api");
const app = express();
const port = 3000;

// Create a new service
const service = new Service();

service.initialise().then(() => {
    app.get("/", (req, res) => {
        res.send("...");
    });

    app.use("/api", createVulpesAPIRouter(service));

    app.listen(port, () => {
        console.log(`Application listening on port ${port}`);
    });
});
```

The primary method `createVulpesAPIRouter` takes a Vulpes `Service` instance as the first paramter:

```javascript
createVulpesAPIRouter(service, {
    cors: true,
    log: logInstance
});
```

The options parameter is optional, as are all of its subsequent properties. The `log` parameter expects an object or instance that provides methods like `info`, `warn`, `error` etc. (much like [Bunyan](https://github.com/trentm/node-bunyan)). The exported value is basically an ExpressJS `Router` instance (actually from [express-promise-router](https://github.com/express-promise-router/express-promise-router)).
