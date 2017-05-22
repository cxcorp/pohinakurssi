"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Promise = require("bluebird");
const child_process = require("child_process");
const logger_1 = require("../logger");
const logger = logger_1.default(__filename);
const exec = Promise.promisify(child_process.exec);
class CachingProcessWatcher {
    constructor(cacheAge) {
        this.cacheAge = cacheAge;
        this.processes = [];
    }
    start() {
        if (this.initialized) {
            throw new Error('Cannot start process watcher twice!');
        }
        this.initialized = true;
        return this.update().then(() => {
            this.updateTimer = setInterval(this.update.bind(this), this.cacheAge);
        });
    }
    fetch() {
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
    update() {
        return fetchProcs().then(procs => {
            this.processes = procs;
        });
    }
}
exports.CachingProcessWatcher = CachingProcessWatcher;
function fetchProcs() {
    const psCommand = 'ps -Ao pid,%cpu,%mem,user,command';
    return exec(psCommand).then((stdout) => parsePsOutput(stdout));
}
/**
 * Parses the table produced by `ps -o pid,%cpu,%mem,user,command`
 */
function parsePsOutput(psOutput) {
    const lines = splitLines(psOutput);
    return _.drop(lines, 1)
        .filter(arr => !_.isEmpty(arr))
        .map(parseLine)
        .filter(p => !_.isNil(p));
}
function parseLine(line) {
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
        logger.warn('Failed to parse a PS line! Tokens: [%s]', tokens.join(', '));
        return undefined;
    }
    return { pid, cpu, mem, user, command: command.join(' ') };
}
function splitLines(input) {
    return input.split('\n');
}
//# sourceMappingURL=processWatcher.js.map