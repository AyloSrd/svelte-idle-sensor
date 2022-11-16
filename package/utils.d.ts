export declare type IdleEvent = CustomEvent<{
    lastFiredEvent: Event;
}>;
export declare type ActivityEvent = CustomEvent<{
    triggeringEvent: Event;
}>;
export declare type RemindEvent = IdleEvent;
export declare type TabActivityEvent = CustomEvent<{
    isMainTab: boolean;
}>;
export declare type EventTypeName = keyof DocumentEventMap;
export declare const EVENTS: EventTypeName[];
export declare const FIFTEEN_MINUTES = 900000;
export declare const THROTTLE_DELAY = 250;
export declare const IS_BROWSER: boolean;
export declare function throttler(delay: number): () => boolean;
