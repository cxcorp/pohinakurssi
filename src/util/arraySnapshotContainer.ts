import * as arrayUtils from './arrayUtils';

export interface SnapshotDelta<T> {
    created: ReadonlyArray<T>;
    removed: ReadonlyArray<T>;
}

export class ArraySnapshotContainer<T> {
    private oldSnapshot: T[] = [];

    public update(newSnapshot: T[]): SnapshotDelta<T> {
        const newSnap = [...newSnapshot];
        const created = arrayUtils.except(newSnap, this.oldSnapshot);
        const removed = arrayUtils.except(this.oldSnapshot, newSnap);

        this.oldSnapshot = newSnap;
        return { created, removed };
    }
}
