"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logger_1 = require("../logger");
const logger = logger_1.default(__filename);
const swaggerSpec = require('../../data/swagger.json');
function createRouter(processWatcher) {
    const router = express.Router();
    router.get('/swagger.json', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.json(swaggerSpec);
    });
    router.get('/processes', (req, res) => {
        processWatcher.fetch().then(procs => {
            res.json({
                result: procs
            });
        }).catch(err => {
            logger.error('An error occurred while fetching the process list', err);
            res.status(500).json({
                result: [],
                err: 'An error occurred while fetching the process list.'
            });
        });
    });
    router.use(((err, req, res, next) => {
        logger.error('Uncaught error caught!', err);
        res.json({
            err: 'An error has occurred.'
        });
    }));
    return router;
}
exports.default = createRouter;
//# sourceMappingURL=index.js.map