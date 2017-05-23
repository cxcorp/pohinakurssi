"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const express = require("express");
const logger_1 = require("../logger");
const logger = logger_1.default(__filename);
function createRouter(processWatcher) {
    const router = express.Router();
    router.get('/swagger.json', (req, res) => {
        const filePath = path.resolve('../../data/swagger.json');
        res.sendFile(filePath);
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
                error: 'An error occurred while fetching the process list.'
            });
        });
    });
    return router;
}
exports.default = createRouter;
//# sourceMappingURL=index.js.map