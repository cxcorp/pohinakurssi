declare module 'inotify' {
    export class Inotify {
        constructor(persistent?: boolean);
        public addWatch(args: WatchOptions): WatchDescriptor;
        public removeWatch(watch: WatchDescriptor): boolean;
        public close(): boolean;

        /** File was accessed (read) */
        public static readonly IN_ACCESS: WatchFlag;
        /** Metadata changed, e.g., permissions, timestamps, extended attributes, link count (since Linux 2.6.25), UID, GID, etc. */
        public static readonly IN_ATTRIB: WatchFlag;
        /** File opened for writing was closed */
        public static readonly IN_CLOSE_WRITE: WatchFlag;
        /** File not opened for writing was closed */
        public static readonly IN_CLOSE_NOWRITE: WatchFlag;
        /** File/directory created in the watched directory */
        public static readonly IN_CREATE: WatchFlag;
        /** File/directory deleted from the watched directory */
        public static readonly IN_DELETE: WatchFlag;
        /** Watched file/directory was deleted */
        public static readonly IN_DELETE_SELF: WatchFlag;
        /** File was modified */
        public static readonly IN_MODIFY: WatchFlag;
        /** Watched file/directory was moved */
        public static readonly IN_MOVE_SELF: WatchFlag;
        /** File moved out of the watched directory */
        public static readonly IN_MOVED_FROM: WatchFlag;
        /** File moved into watched directory */
        public static readonly IN_MOVED_TO: WatchFlag;
        /** File was opened */
        public static readonly IN_OPEN: WatchFlag;
        /** Watch for all kind of events */
        public static readonly IN_ALL_EVENTS: WatchFlag;
        /** (IN_CLOSE_WRITE | IN_CLOSE_NOWRITE) Close */
        public static readonly IN_CLOSE: WatchFlag;
        /** (IN_MOVED_FROM | IN_MOVED_TO) Moves */
        public static readonly IN_MOVE: WatchFlag;

        /** Only watch the path if it is a directory. */
        public static readonly IN_ONLYDIR: AdditionalWatchFlag;
        /** Do not follow symbolics links */
        public static readonly IN_DONT_FOLLOW: AdditionalWatchFlag;
        /** Only send events once */
        public static readonly IN_ONESHOT: AdditionalWatchFlag;
        /** Add (OR) events to watch mask for this pathname if it already exists (instead of replacing the mask). */
        public static readonly IN_MASK_ADD: AdditionalWatchFlag;

        // Additional flags that may be set in the event.mask of the callback
        public static readonly IN_IGNORED: AdditionalEventFlag;
        public static readonly IN_ISDIR: AdditionalEventFlag;
        public static readonly IN_Q_OVERFLOW: AdditionalEventFlag;
        public static readonly IN_UNMOUNT: AdditionalEventFlag;
    }

    export type WatchDescriptor = number;
    export type EventCookie = number;

    export interface WatchOptions {
        path: string;
        watch_for: WatchFlag | AdditionalWatchFlag;
        callback: (event: Event) => void;
    }

    export interface Event {
        watch: WatchDescriptor;
        mask: WatchFlag | AdditionalWatchFlag | AdditionalEventFlag;
        cookie: EventCookie;
        name?: string;
    }

    export type WatchFlag = number;
    export type AdditionalWatchFlag = number;
    export type AdditionalEventFlag = number;
}