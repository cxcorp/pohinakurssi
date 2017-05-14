import { } from 'mocha'; /* it, describe, context, before, beforeEach */
import { expect } from 'chai';
import { SnapshotDelta, ArraySnapshotContainer } from '../../../src/util/arraySnapshotContainer';

/* tslint:disable: no-unused-expression */

describe('ArraySnapshotContainer', () => {
    describe('update', () => {
        it('should show all of the input as created when called for the first time', () => {
            const input = ['1', '1235', 'foo', 'bar'];
            const snapshots = new ArraySnapshotContainer<string>();

            const delta = snapshots.update(input);

            expect(delta.created).to.have.deep.members(input);
        });

        it('shouldn\'t show anything as removed when called for the first time', () => {
            const input = ['1', '1235', 'foo', 'bar'];
            const snapshots = new ArraySnapshotContainer<string>();

            expect(snapshots.update(input).removed).to.be.empty;
        });

        it('should return empty arrays when applying an empty snapshot on an empty snapshot', () => {
            const snapshots = new ArraySnapshotContainer<number>();

            const delta = snapshots.update([]);

            expect(delta.created).to.be.empty;
            expect(delta.removed).to.be.empty;
        });

        it('should return created elements correctly', () => {
            const snapshots = new ArraySnapshotContainer<number>();
            snapshots.update([1, 2, 3]);

            const delta = snapshots.update([1, 2, 3, 4, 5, 6]);

            expect(delta.created).to.have.deep.members([4, 5, 6]);
        });

        it('should return created elements even when they are out of order', () => {
            const snapshots = new ArraySnapshotContainer<number>();
            snapshots.update([10, 100, 12345, 5]);

            const delta = snapshots.update([12345, 10, 5, 100, 123, 456]);

            expect(delta.created).to.have.deep.members([456, 123]);
        });

        it('should return removed elements correctly', () => {
            const snapshots = new ArraySnapshotContainer<number>();
            snapshots.update([0, 1, 2, 3, 4]);

            const delta = snapshots.update([]);

            expect(delta.created).to.be.empty;
            expect(delta.removed).to.have.deep.members([0, 1, 2, 3, 4]);
        });

        it('should return created and removed elements correctly', () => {
            const snapshots = new ArraySnapshotContainer<number>();
            snapshots.update([1, 2, 3, 4, 5, 6, 7, 8]);

            const delta = snapshots.update([3, 333, 4, 5, 6, 7, 8, 111, 222]);

            expect(delta.created).to.have.deep.members([111, 222, 333]);
            expect(delta.removed).to.have.deep.members([1, 2]);
        });
    });
});