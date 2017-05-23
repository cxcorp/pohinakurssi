import { } from 'mocha'; /* it, describe, context, before, beforeEach */
import { expect } from 'chai';
import { parsePsOutput } from '../../../src/util/processWatcher';

/* tslint:disable: no-unused-expression */

describe('parsePsOutput', () => {
    it('should ignore header row', () => {
        const inputValidHeader =
            '   PID  %CPU %MEM USER          COMMAND\n57656   0.0  0.1 joonapersonal -zsh';
        const inputInvalidHeader =
            'kekekkekekekekkekekekekekekeke21342565762\n57656   0.0  0.1 joonapersonal -zsh';
        const missingHeader = '\n57656   0.0  0.1 joonapersonal -zsh';

        const outputs = [inputValidHeader, inputInvalidHeader, missingHeader].map(parsePsOutput);

        expect(outputs[0]).to.be.deep.equal([
            { pid: 57656, cpu: 0.0, mem: 0.1, user: 'joonapersonal', command: '-zsh' }
        ]);
        for (const output of outputs) {
            for (const otherOutput of outputs) {
                expect(output).to.be.deep.equal(otherOutput);
            }
        }
    });

    it('should parse correctly when there is only one space between columns', () => {
        const input = [
            [''],
            ['123', '15.0', '0.5', 'joonapersonal', 'command kekekek'],
            ['0', '0.0', '0.0', 'me', 'kekbox'],
        ].map(ar => ar.join(' ')).join('\n');

        const output = parsePsOutput(input);

        expect(output.length).to.eq(2);
        expect(output).to.have.deep.members([
            { pid: 123, cpu: 15.0, mem: 0.5, user: 'joonapersonal', command: 'command kekekek' },
            { pid: 0, cpu: 0.0, mem: 0.0, user: 'me', command: 'kekbox' }
        ]);
    });

    it('should parse correctly when there are multiple spaces between columns', () => {
        const input = '\n 1234  15.0  0.3  joonapersonal kekbox --force' +
            '\n51234   0.0 11.0  admin         Chrome --renderer=123 asdasd kekekek' +
            '\n    1   0.0  0.0  root          root';

        const output = parsePsOutput(input);

        expect(output.length).to.eq(3);
        expect(output).to.have.deep.members([
            {
                pid: 1234,
                cpu: 15,
                mem: 0.3,
                user: 'joonapersonal',
                command: 'kekbox --force'
            },
            {
                pid: 51234,
                cpu: 0,
                mem: 11,
                user: 'admin',
                command: 'Chrome --renderer=123 asdasd kekekek'
            },
            { pid: 1, cpu: 0, mem: 0, user: 'root', command: 'root' }
        ]);
    });
});