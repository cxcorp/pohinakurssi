import * as express from 'express';
import * as dotenv from 'dotenv';
import { Inotify } from 'inotify';
import createLogger from './logger';
const logger = createLogger(__filename);
dotenv.config();

const inotify = new Inotify();

if (process.env === 'development') {
    process.once('SIGUSR2', () => {
        inotify.close();
        process.kill(process.pid, 'SIGUSR2');
    });
}

const app = express();
app.get('/', (req, res) => {
    res.json({ result: 'Hello World!' });

});
app.listen(1235, () => {

    const wd = inotify.addWatch({
        path: './',
        watch_for: Inotify.IN_CREATE,
        callback: event => {
            logger.info('Event! ', event);
            inotify.close();
        }
    });

    logger.info('wd ' + wd);
    logger.info('Server started on port 1235');
});
