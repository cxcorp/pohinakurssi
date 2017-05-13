import * as path from 'path';
import { EventEmitter } from 'events';
import * as chokidar from 'chokidar';
import { ProcessWatcher } from './processWatcher';
import createLogger from '../../logger';

const DEFAULT_PROC_PATH = '/proc';

export function forLinux(procPath: string = DEFAULT_PROC_PATH): ProcessWatcher.Watcher {
    const emitter: ProcessWatcher.Watcher = new EventEmitter();

    const watcher = chokidar.watch(procPath, {
        useFsEvents: false,
        usePolling: true,
        depth: 0
    });
    watcher.on('ready', () => {
        const paths = watcher.getWatched()[procPath];
        const pids = paths.map(p => parseInt(p, 10)).filter(p => !isNaN(p));
        emitter.emit('watch_ready', { pids });
    });
    watcher.on('addDir', (createdPath: string) => {
        const dirName = path.basename(createdPath);
        const pid = parseInt(dirName, 10);
        if (!isNaN(pid)) {
            emitter.emit('proc_created', { pid });
        }
    });
    watcher.on('unlinkDir', (unlinkedPath: string) => {
        const dirName = path.basename(unlinkedPath);
        const pid = parseInt(dirName, 10);
        if (!isNaN(pid)) {
            emitter.emit('proc_died', { pid });
        }
    });

    return emitter;
}
