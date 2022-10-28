import { EVENTS, IS_BROWSER, THROTTLE_DELAY, throttler } from './utils'
import { BroadcastChannelPolyfill } from './BroadcastChannelPolyfill.js'

const BROADCAST_CHANNEL = 'cross-tab-channel'
const ACTIVITY_MSG = 'activity in another tab'
const TAB_ACTIVITY_EVENT_NAME = 'tabActivity'


export function onTabActivity(
	handleTabActivity: (evt: CustomEvent<{ isMainTab: boolean }>) => void
) {
	if (!IS_BROWSER) return () => undefined;

	let isMainTab = false;

	const shouldThrottle = throttler(THROTTLE_DELAY * 2);

	const bc = window.BroadcastChannel
		? new BroadcastChannel(BROADCAST_CHANNEL)
		: new BroadcastChannelPolyfill(BROADCAST_CHANNEL);

	bc.addEventListener('message', handleMessage);

	for (const evt of EVENTS) {
		if (evt === 'visibilitychange') {
			window.addEventListener(evt, handleVisibilityChange);
		} else {
			window.addEventListener(evt, handleActivity);
		}
	}

	function handleMessage(evt: MessageEvent) {
		if (evt.data === ACTIVITY_MSG) {
			isMainTab = false;
			handleTabActivity(new CustomEvent(TAB_ACTIVITY_EVENT_NAME, { detail: { isMainTab } }));
		}
	}

	function handleActivity() {
		if (isMainTab) return;
		if (shouldThrottle()) return;
		isMainTab = true;
		handleTabActivity(new CustomEvent(TAB_ACTIVITY_EVENT_NAME, { detail: { isMainTab } }));
		bc.postMessage(ACTIVITY_MSG);
	}

	function handleVisibilityChange() {
		if (document.visibilityState === 'visible') handleActivity();
	}

	function cleanUp() {
		for (const evt of EVENTS) {
			if (evt === 'visibilitychange') {
				window.removeEventListener(evt, handleVisibilityChange);
			} else {
				window.removeEventListener(evt, handleActivity);
			}
		}

		bc.removeEventListener('message', handleMessage);
		bc.close();
	}

	return cleanUp;
}
