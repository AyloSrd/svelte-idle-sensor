import type { EventTypeName, IdleEvent, RemindEvent, ActivityEvent, TabActivityEvent } from './utils';
import type { Readable } from 'svelte/store';
export interface IdleSensorOptions {
    multitabSensor?: string;
    events?: EventTypeName[];
    idleTimeout?: number;
    reminderDuration?: number;
    startManually?: boolean;
    onIdle?: (idleEvt: IdleEvent) => void;
    onActive?: (activyEvt: ActivityEvent) => void;
    onRemind?: (remindEvt: RemindEvent) => void;
    onTabActivity?: (tabActivityEvt: TabActivityEvent) => void;
}
export interface IdleSensorReturn {
    idle: Readable<boolean>;
    reminding: Readable<boolean>;
    reset: () => void;
    start: () => void;
    stop: () => void;
}
declare function stopListening(): void;
export declare function initializeIdleSensor({ idleTimeout, multitabSensor, events, reminderDuration, startManually, onIdle, onActive, onRemind, onTabActivity }?: IdleSensorOptions): IdleSensorReturn;
export declare const idle: Readable<boolean>;
export declare const reminding: Readable<boolean>;
export declare const reset: () => void;
export declare const start: () => void;
export declare const stop: typeof stopListening;
export {};
