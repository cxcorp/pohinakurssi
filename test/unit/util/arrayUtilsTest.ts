import { } from 'mocha'; /* it, describe, context, before, beforeEach */
import { expect } from 'chai';
import { except } from '../../../src/util/arrayUtils';

/* tslint:disable: no-unused-expression */

describe('Array utils', () => {
    describe('except', () => {
        it('should return nothing when the arrays are the same', () => {
            const arr = [1, 2, 3, 4, 5];
            expect(except(arr, arr)).to.be.empty;
        });

        it('should return nothing when the arrays are identical', () => {
            expect(except(['ayy', 'lmao'], ['ayy', 'lmao'])).to.be.empty;
        });

        it('should return nothing when the second array has many more elements', () => {
            expect(except([1], [-100, 1, 2, 3, 4, 5, 6])).to.be.empty;
        });

        it('should return the diff when there is one extra element', () => {
            expect(except([100, 200, 300, 400], [100, 200, 300]))
                .to.be.deep.eq([400]);
        });

        it('should return the diff when there are many extra elements', () => {
            expect(except([100, 200, 300, 5, 6, 7, 8], [100, 200, 300]))
                .to.have.deep.members([5, 6, 7, 8]);
        });

        it('should not care about the order of the elements', () => {
            expect(except([9, 8, 7, 1, 3, 2], [8, 2, 9]))
                .to.have.deep.members([1, 3, 7]);
            expect(except(['a', 'foo', 'Åöäol', 'CCCC', 'toast'], ['toast', 'foo']))
                .to.have.deep.members(['CCCC', 'Åöäol', 'a']);
        });
    });
});