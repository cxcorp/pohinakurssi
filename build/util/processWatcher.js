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
        this.initialized = false;
        this.processes = [];
    }
    start() {
        if (this.initialized) {
            throw new Error('Cannot start process watcher twice!');
        }
        this.initialized = true;
        const updt = (() => {
            this.update().then(() => {
                this.updateTimer = setTimeout(updt, this.cacheAge);
            });
        }).bind(this);
        return this.update().then(() => {
            this.updateTimer = setTimeout(updt, this.cacheAge);
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
 *
 * Example input:
 *
 *   PID  %CPU %MEM USER          COMMAND
 * 57656   0.0  0.1 joonapersonal -zsh
 *   123  11.5 11.9 joonapersonal /Applications/iTerm.app/Contents/MacOS/iTerm2 --server login
 *  1234   0.1  0.0 joonapersonal Blah --yeah boiii
 */
function parsePsOutput(psOutput) {
    const lines = splitLines(psOutput);
    return _.drop(lines, 1)
        .filter(arr => !_.isEmpty(arr))
        .map(parseLine)
        .filter(p => !_.isNil(p));
}
exports.parsePsOutput = parsePsOutput;
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