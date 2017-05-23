import * as _ from 'lodash';
import * as Promise from 'bluebird';
import * as child_process from 'child_process';
import createLogger from '../logger';
const logger = createLogger(__filename);

const exec = Promise.promisify(child_process.exec) as (cmd: string) => Promise<string>;

export interface Process {
    pid: number;
    cpu: number;
    mem: number;
    user: string;
    command: string;
}

export class CachingProcessWatcher {
    private initialized: boolean = false;
    private processes: Process[] = [];
    private updateTimer?: NodeJS.Timer;

    constructor(private readonly cacheAge: number) {
    }

    start(): Promise<void> {
        if (this.initialized) {
            throw new Error('Cannot start process watcher twice!');
        }

        this.initialized = true;
        return this.update().then(() => {
            this.updateTimer = setInterval(this.update.bind(this), this.cacheAge);
        });
    }

    fetch(): Promise<Process[]> {
        if (!this.initialized) {
            throw new Error('Watcher has to be initialized!');
        }
        return Promise.resolve(this.processes);
    }

    dispose() {
        if (!this.initialized) {
            throw new Error('Cannot dispose a non-initialized process watcher');
        }
        if (this.updateTimer === undefined) {
            throw new Error('Cannot dispose a disposed process watcher!');
        }
        clearTimeout(this.updateTimer);
        this.updateTimer = undefined;
    }

    private update(): Promise<void> {
        return fetchProcs().then(procs => {
            this.processes = procs;
        });
    }
}

function fetchProcs(): Promise<Process[]> {
    const psCommand = 'ps -Ao pid,%cpu,%mem,user,command';
    return exec(psCommand).then((stdout: string) => parsePsOutput(stdout));
}

/**
 * Parses the table produced by `ps -o pid,%cpu,%mem,user,command`
 */
export function parsePsOutput(psOutput: string): Process[] {
    const lines = splitLines(psOutput);
    return _.drop(lines, 1)
        .filter(arr => !_.isEmpty(arr))
        .map(parseLine)
        .filter(p => !_.isNil(p)) as Process[];
}

function parseLine(line: string): Process | undefined {
    const tokenCount = 5;
    const tokens = line.trim().split(/ +/);

    if (tokens === null || tokens.length < tokenCount) {
        logger.warn('Failed to parse a PS line: [%s]', line);
        return undefined;
    }

    const [pidStr, cpuStr, memStr, user, ...command] = tokens;
    const pid = parseInt(pidStr, 10);
    const cpu = parseFloat(cpuStr.replace(',', '.'));
    const mem = parseFloat(memStr.replace(',', '.'));

    if (_.some([pid, cpu, mem], isNaN)) {
        logger.warn(
            'Failed to parse a PS line! Tokens: [%s]',
            tokens.join(', ')
        );
        return undefined;
    }

    return { pid, cpu, mem, user, command: command.join(' ') };
}

function splitLines(input: string): string[] {
    return input.split('\n');
}
