import * as Promise from 'bluebird';
import * as fs from 'fs';
import { EventEmitter } from 'events';
import { ArraySnapshotContainer, SnapshotDelta } from './arraySnapshotContainer';
import createLogger from '../logger';
const logger = createLogger(__filename);

export type Event = 'ready' | 'created' | 'unlinked';

export interface DirChangeEventEmitter extends EventEmitter {
    on(event: Event, callback: (changedEntries: ReadonlyArray<string>) => void): this;
    emit(event: Event, changedEntries: ReadonlyArray<string>): boolean;
}

interface DirWatcherOptions {
    directory: string;
    pollInterval: number;
    filter?: (fileEntry: string) => boolean;
}

export class DirWatcher {
    private readonly snapshots: ArraySnapshotContainer<string>;
    private filterFiles: (fileEntries: string[]) => string[];
    private updateTimer?: NodeJS.Timer;

    constructor(
        private readonly opts: DirWatcherOptions,
        private readonly emitter: DirChangeEventEmitter
    ) {
        this.snapshots = new ArraySnapshotContainer<string>();
        if (opts.filter !== undefined) {
            this.filterFiles = (f => f.filter(opts.filter!));
        } else {
            this.filterFiles = (f => f);
        }
    }

    public start(): void {
        this.updateSnapshot().then(delta => {
            this.emitter.emit('ready', delta.created);
        });

        this.updateTimer = setInterval(() => {
            this.updateSnapshot().then(delta => this.emitEvents(delta));
        }, this.opts.pollInterval);
    }

    public stop(): void {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = undefined;
        }
    }

    private emitEvents(delta: SnapshotDelta<string>): void {
        if (delta.created.length > 0) {
            this.emitter.emit('created', delta.created);
        }
        if (delta.removed.length > 0) {
            this.emitter.emit('unlinked', delta.removed);
        }
    }

    private updateSnapshot(): Promise<SnapshotDelta<string>> {
        const stack = new Error().stack;

        const readdir = Promise.promisify(fs.readdir);
        return readdir(this.opts.directory)
            .then(this.filterFiles)
            .then(snap => this.snapshots.update(snap))
            .catch(err => {
                logger.error('Error while updating snapshot: error %s, stack:\n%s', err, stack);
                throw err;
            });
    }
}


export type DirWatcherBuilderOptions = Partial<DirWatcherOptions>;
type EventArgs = { event: Event, cb: (changedDirs: string[]) => void };

export class DirWatcherBuilder {
    private readonly opts: Partial<DirWatcherBuilderOptions> = {};
    private readonly onEventArgs: EventArgs[] = [];

    public directory(pollDir: string): this {
        this.opts.directory = pollDir;
        return this;
    }

    public pollInterval(interval: number): this {
        this.opts.pollInterval = interval;
        return this;
    }

    public directoryEntryFilter(filter: (entry: string) => boolean): this {
        this.opts.filter = filter;
        return this;
    }

    public on(event: Event, cb: (eventArgs: string[]) => void): this {
        this.onEventArgs.push({ event, cb });
        return this;
    }

    public create(): DirWatcher {
        const opts = this.assertAllRequiredPresent(this.opts);
        const emitter: DirChangeEventEmitter = new EventEmitter();
        this.onEventArgs.forEach(args => emitter.on(args.event, args.cb));
        return new DirWatcher(opts, emitter);
    }

    private assertAllRequiredPresent(opts: Partial<DirWatcherBuilderOptions>): DirWatcherOptions {
        if (opts.directory !== undefined
            && opts.pollInterval !== undefined
        ) {
            // filter can be undefined
            return opts as DirWatcherOptions;
        }

        throw new Error('Missing required builder options!');
    }
}
