import * as fs from 'fs';
import * as express from 'express';
import * as dotenv from 'dotenv';
import * as c from 'chalk';
import { DirWatcherBuilder, DirWatcher } from './util/dirWatcher';
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

    const watcher = new DirWatcherBuilder()
        .directory('./')
        .pollInterval(1000)
        .directoryEntryFilter(e => !isNaN(parseInt(e, 10)))
        .on('ready', dirs => logger.info('READY    [ %s ... ]', dirs.slice(0, 10).join(', ')))
        .on('created', dirs => logger.info('CREATED  [ %s ]', dirs.join(', ')))
        .on('unlinked', dirs => logger.info('UNLINKED [ %s ]', dirs.join(', ')))
        .create();
    watcher.start();
});
