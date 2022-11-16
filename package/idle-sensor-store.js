import { EVENTS, FIFTEEN_MINUTES, IS_BROWSER, THROTTLE_DELAY, throttler } from './utils';
import { onTabActivity as onTabActivityImported } from './tabchange-handler.js';
import { writable } from 'svelte/store';
import { onMount, onDestroy } from 'svelte';
const { subscribe: isIdle, set: setIdleStore } = writable(false);
const { subscribe: isReminding, set: setRemindStore } = writable(false);
let initialized = false;
let idleLocal = false;
let remindingLocal = false;
let idleTimeoutLocal = FIFTEEN_MINUTES;
let eventsLocal = EVENTS;
let reminderDurationLocal = 0;
let startManuallyLocal = false;
let onIdleLocal;
let onActiveLocal;
let onRemindLocal;
let onTabActivityLocal;
let listenersAreOn = false;
let idleTimeoutId;
let reminderTimeoutId;
let cleanTabListeners = null;
const shouldThrottle = throttler(THROTTLE_DELAY);
function setIdle(isIdle) {
    setIdleStore(isIdle);
    idleLocal = isIdle;
}
function setReminding(isIdle) {
    setRemindStore(isIdle);
    remindingLocal = isIdle;
}
function handleEvent(evt) {
    if (shouldThrottle())
        return;
    if (idleLocal)
        onActiveLocal?.(new CustomEvent('active', { detail: { triggeringEvent: evt } }));
    if (!remindingLocal)
        timerReset(evt);
}
function addListeners() {
    if (!IS_BROWSER || listenersAreOn || typeof eventsLocal === 'undefined')
        return;
    for (const evt of eventsLocal) {
        document.addEventListener(evt, handleEvent);
    }
    listenersAreOn = true;
}
function timerReset(evt) {
    if (!listenersAreOn)
        return;
    timerCleanup();
    cleanSubscriptions();
    setIdleTimer(evt);
}
function timerCleanup() {
    if (typeof idleTimeoutId === 'number')
        clearTimeout(idleTimeoutId);
    if (typeof reminderTimeoutId === 'number')
        clearTimeout(reminderTimeoutId);
}
function setIdleTimer(evt) {
    idleTimeoutId = setTimeout(() => {
        setReminding(true);
        onRemindLocal?.(new CustomEvent('remind', { detail: { lastFiredEvent: evt } }));
        setReminderTimer(evt);
    }, idleTimeoutLocal);
}
function setReminderTimer(evt) {
    reminderTimeoutId = setTimeout(() => {
        setIdle(true);
        setReminding(false);
        onIdleLocal?.(new CustomEvent('idle', { detail: { lastFiredEvent: evt } }));
    }, reminderDurationLocal);
}
function cleanSubscriptions() {
    setIdle(false);
    setReminding(false);
}
function cleanLocalState() {
    initialized = false;
    idleTimeoutLocal = FIFTEEN_MINUTES;
    eventsLocal = EVENTS;
    reminderDurationLocal = 0;
    startManuallyLocal = false;
    onIdleLocal = undefined;
    onActiveLocal = undefined;
    onRemindLocal = undefined;
    cleanTabListeners?.();
    cleanTabListeners = null;
}
function startListening(evt = new CustomEvent('manualstart')) {
    timerCleanup();
    cleanSubscriptions();
    addListeners();
    timerReset(evt);
}
function stopListening() {
    timerCleanup();
    cleanSubscriptions();
    removeListeners();
}
function removeListeners() {
    if (!listenersAreOn || typeof eventsLocal === 'undefined')
        return;
    for (const evt of eventsLocal) {
        document.removeEventListener(evt, handleEvent);
    }
    listenersAreOn = false;
}
function handleTabActivityLocal(evt) {
    const { detail: { isMainTab } } = evt;
    onTabActivityLocal?.(evt);
    if (!isMainTab)
        return stopListening();
    if (isMainTab && !startManuallyLocal)
        startListening(evt);
}
export function initializeIdleSensor({ idleTimeout = FIFTEEN_MINUTES, multitabSensor, events = EVENTS, reminderDuration = 0, startManually = false, onIdle, onActive, onRemind, onTabActivity } = {}) {
    if (initialized) {
        stopListening();
        cleanTabListeners?.();
    }
    initialized = true;
    idleTimeoutLocal = idleTimeout;
    eventsLocal = events;
    reminderDurationLocal = reminderDuration;
    startManuallyLocal = startManually;
    onIdleLocal = onIdle;
    onActiveLocal = onActive;
    onRemindLocal = onRemind;
    onTabActivityLocal = onTabActivity;
    cleanTabListeners = typeof multitabSensor === 'string' ? onTabActivityImported(multitabSensor, handleTabActivityLocal) : null;
    onMount(() => {
        if (startManually)
            return;
        startListening(new CustomEvent('mount'));
    });
    onDestroy(() => {
        cleanTabListeners?.();
        stopListening();
        cleanLocalState();
    });
    return {
        idle: { subscribe: isIdle },
        reminding: { subscribe: isReminding },
        start: () => startListening(),
        reset: () => timerReset(new CustomEvent('manualreset')),
        stop: stopListening
    };
}
export const idle = { subscribe: isIdle };
export const reminding = { subscribe: isReminding };
export const reset = () => {
    if (!initialized)
        return;
    timerReset(new CustomEvent('manualreset'));
};
export const start = () => {
    if (!initialized)
        return;
    startListening();
};
export const stop = stopListening;
