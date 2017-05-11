import * as express from 'express';
import * as dotenv from 'dotenv';
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
});
