"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dotenv = require("dotenv");
const processWatcher_1 = require("./util/processWatcher");
const logger_1 = require("./logger");
const logger = logger_1.default(__filename);
dotenv.config();
if (process.env === 'development') {
    process.once('SIGUSR2', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
}
const watcher = new processWatcher_1.CachingProcessWatcher(1000);
const app = express();
app.get('/processes', (req, res) => {
    watcher.fetch().then(procs => {
        res.json({
            result: procs
        });
    }).catch(err => {
        res.status(500).json({
            result: [],
            error: err
        });
    });
});
watcher.start().then(() => {
    const port = process.env.PORT || 1235;
    app.listen(port, () => {
        logger.info('Server started on port ' + port);
    });
});
//# sourceMappingURL=index.js.map