import * as express from 'express';
import { CachingProcessWatcher, Process } from '../util/processWatcher';
import createLogger from '../logger';
const logger = createLogger(__filename);

export default function createRouter(processWatcher: CachingProcessWatcher) {
    const router = express.Router();

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