import type { EventTypeName, TabActivityEvent } from './utils';
import type { Readable } from 'svelte/store';

import { EVENTS, FIFTEEN_MINUTES, IS_BROWSER, THROTTLE_DELAY, throttler } from './utils';
import { onTabActivity as onTabActivityImported } from './tabchange-handler.js';
import { writable } from 'svelte/store';
import { onMount, onDestroy } from 'svelte';

type IdleEvent = CustomEvent<{ lastFiredEvent: Event }>
type RemindEvent = IdleEvent
type ActivityEvent = CustomEvent<{ triggeringEvent: Event }>

export interface IdleSensorOptions {
	crosstab?: boolean;
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

const { subscribe: isIdle, set: setIdleStore } = writable(false);
const { subscribe: isReminding, set: setRemindStore } = writable(false);

let initialized = false;

let idleLocal = false;
let remindingLocal = false;

let idleTimeoutLocal: IdleSensorOptions['idleTimeout'] = FIFTEEN_MINUTES;
let eventsLocal: IdleSensorOptions['events'] = EVENTS;
let reminderDurationLocal: IdleSensorOptions['reminderDuration'] = 0;
let startManuallyLocal: IdleSensorOptions['startManually'] = false;
let onIdleLocal: IdleSensorOptions['onIdle'];
let onActiveLocal: IdleSensorOptions['onActive'];
let onRemindLocal: IdleSensorOptions['onRemind'];
let onTabActivityLocal: IdleSensorOptions['onTabActivity'];

let listenersAreOn = false;
let idleTimeoutId: ReturnType<typeof setTimeout>;
let reminderTimeoutId: ReturnType<typeof setTimeout>;

let cleanTabListeners: null | (() => void) = null;

const shouldThrottle = throttler(THROTTLE_DELAY);

function setIdle(isIdle: boolean) {
	setIdleStore(isIdle);
	idleLocal = isIdle;
}

function setReminding(isIdle: boolean) {
	setRemindStore(isIdle);
	remindingLocal = isIdle;
}

function handleEvent(evt: Event) {
	if (shouldThrottle()) return;
	if (idleLocal) onActiveLocal?.(new CustomEvent('active', { detail: { triggeringEvent: evt } }));
	if (!remindingLocal) timerReset(evt);
}

function addListeners() {
	if (!IS_BROWSER || listenersAreOn || typeof eventsLocal === 'undefined') return;
	for (const evt of eventsLocal) {
		document.addEventListener(evt, handleEvent);
	}

	listenersAreOn = true;
}

function timerReset(evt: Event) {
	if (!listenersAreOn) return;

	timerCleanup();
	cleanSubscriptions();
	setIdleTimer(evt);
}

function timerCleanup() {
	if (typeof idleTimeoutId === 'number') clearTimeout(idleTimeoutId);
	if (typeof reminderTimeoutId === 'number') clearTimeout(reminderTimeoutId);
}

function setIdleTimer(evt: Event) {
	idleTimeoutId = setTimeout(() => {
		setReminding(true);
		onRemindLocal?.(new CustomEvent('remind', { detail: { lastFiredEvent: evt } }));
		setReminderTimer(evt);
	}, idleTimeoutLocal);
}

function setReminderTimer(evt: Event) {
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

function startListening(evt: Event = new CustomEvent('manualstart')) {
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
	if (!listenersAreOn || typeof eventsLocal === 'undefined') return;
	for (const evt of eventsLocal) {
		document.removeEventListener(evt, handleEvent);
	}

	listenersAreOn = false;
}

function handleTabActivityLocal(evt: TabActivityEvent) {
	const {
		detail: { isMainTab }
	} = evt;

    onTabActivityLocal?.(evt)

	if (!isMainTab) return stopListening();
	if (isMainTab && !startManuallyLocal) startListening(evt);
}

export function initializeIdleSensor({
	idleTimeout = FIFTEEN_MINUTES,
	crosstab = false,
	events = EVENTS,
	reminderDuration = 0,
	startManually = false,
	onIdle,
	onActive,
	onRemind,
    onTabActivity
}: IdleSensorOptions = {}): IdleSensorReturn {
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

	cleanTabListeners = crosstab ? onTabActivityImported(handleTabActivityLocal) : null;

	onMount(() => {
		if (startManually) return;
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

export const idle: Readable<boolean> = { subscribe: isIdle };
export const reminding: Readable<boolean> = { subscribe: isReminding };

export const reset = () => {
	if (!initialized) return;

	timerReset(new CustomEvent('manualreset'));
};

export const start = () => {
	if (!initialized) return;

	startListening();
};

export const stop = stopListening;