"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");
const processWatcher_1 = require("./util/processWatcher");
const _1 = require("./router/");
const logger_1 = require("./logger");
const logger = logger_1.default(__filename);
dotenv.config();
const app = express();
app.use(helmet());
app.use(compression());
const watcher = new processWatcher_1.CachingProcessWatcher(1000);
app.use('/', _1.default(watcher));
watcher.start().then(() => {
    const port = process.env.PORT || 1235;
    app.listen(port, () => {
        logger.info('Server started on port ' + port);
    });
});
if (process.env === 'development') {
    process.once('SIGUSR2', () => {
        // kill watcher on nodemon restart
        try {
            watcher.dispose();
        }
        catch (ex) {
        }
        process.kill(process.pid, 'SIGUSR2');
    });
}
//# sourceMappingURL=index.js.map