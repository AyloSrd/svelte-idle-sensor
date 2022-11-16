/** @typedef {typeof __propDef.props}  CounterProps */
/** @typedef {typeof __propDef.events}  CounterEvents */
/** @typedef {typeof __propDef.slots}  CounterSlots */
export default class Counter extends SvelteComponentTyped<{}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type CounterProps = typeof __propDef.props;
export type CounterEvents = typeof __propDef.events;
export type CounterSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {};
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
