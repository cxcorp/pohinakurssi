import * as fs from 'fs';
import * as express from 'express';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as dotenv from 'dotenv';
import { CachingProcessWatcher, Process } from './util/processWatcher';
import createRouter from './router/';
import createLogger from './logger';
const logger = createLogger(__filename);
dotenv.config();

const app = express();
app.use(helmet());
app.use(compression());

const watcher = new CachingProcessWatcher(1000);
app.use('/', createRouter(watcher));

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
        } catch (ex) {
        }
        process.kill(process.pid, 'SIGUSR2');
    });
}
