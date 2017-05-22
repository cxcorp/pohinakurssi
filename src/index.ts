import * as fs from 'fs';
import * as express from 'express';
import * as dotenv from 'dotenv';
import { CachingProcessWatcher, Process } from './util/processWatcher';
import createLogger from './logger';
const logger = createLogger(__filename);
dotenv.config();

if (process.env === 'development') {
    process.once('SIGUSR2', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
}

const watcher = new CachingProcessWatcher(1000);

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
