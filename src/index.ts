import * as fs from 'fs';
import * as express from 'express';
import * as dotenv from 'dotenv';
import * as c from 'chalk';
import { ProcessWatcher } from './util/processWatcher/processWatcher';
import createLogger from './logger';
const logger = createLogger(__filename);
dotenv.config();

if (process.env === 'development') {
    process.once('SIGUSR2', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
}

const app = express();

app.get('/', (req, res) => {
    res.json({ result: 'Hello World!' });
});

app.listen(1235, () => {
    logger.info('Server started on port 1235');

    const watcher = ProcessWatcher.forCurrentPlatform();
    watcher.on('watch_ready', e => {
        logger.info(`${c.blue('READY')} pids [ ${e.pids.slice(0, 10).join(', ')} ... ]`);
    });
    watcher.on('proc_created', e => {
        logger.info(`${c.green('CREATED')} pid ${e.pid}`);
    });
    watcher.on('proc_died', e => {
        logger.info(`${c.yellow('DIED')} pid ${e.pid}`);
    });
});
