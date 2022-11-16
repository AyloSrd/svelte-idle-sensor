import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        idleTimeout?: number | undefined;
        multitabSensor: any;
        events?: (keyof DocumentEventMap)[] | undefined;
        reminderDuration?: number | undefined;
        startManually?: boolean | undefined;
    };
    events: {
        idle: CustomEvent<any>;
        active: CustomEvent<any>;
        remind: CustomEvent<any>;
        tabActivity: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type IdleSensorProps = typeof __propDef.props;
export declare type IdleSensorEvents = typeof __propDef.events;
export declare type IdleSensorSlots = typeof __propDef.slots;
export default class IdleSensor extends SvelteComponentTyped<IdleSensorProps, IdleSensorEvents, IdleSensorSlots> {
}
export {};
