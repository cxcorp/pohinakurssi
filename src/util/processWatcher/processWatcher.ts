import { forLinux } from './linux';
import { EventEmitter } from 'events';

export namespace ProcessWatcher {
    export interface ReadyEvent {
        pids: number[];
    }

    export interface CreatedEvent {
        pid: number;
    }

    export interface DisappearedEvent {
        pid: number;
    }

    export type Event = ReadyEvent | CreatedEvent | DisappearedEvent;
    export type EventName = 'watch_ready' | 'proc_created' | 'proc_died';

    export interface Watcher extends EventEmitter {
        on(type: 'watch_ready', listener: (event: ReadyEvent) => void): this;
        on(type: 'proc_created', listener: (event: CreatedEvent) => void): this;
        on(type: 'proc_died', listener: (event: DisappearedEvent) => void): this;
        emit(type: EventName, eventData: Event): boolean;
    }

    export function forCurrentPlatform(): Watcher {
        return forLinux();
    }
}