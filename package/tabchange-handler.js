import { EVENTS, IS_BROWSER, THROTTLE_DELAY, throttler } from './utils';
import { BroadcastChannelPolyfill } from './BroadcastChannelPolyfill.js';
var MSG;
(function (MSG) {
    MSG["new_activity"] = "activity in another tab";
    MSG["need_main"] = "main tab shut down";
})(MSG || (MSG = {}));
const BROADCAST_CHANNEL = (key) => `cross-tab-channel-${key}`;
const TAB_ACTIVITY_EVENT_NAME = 'tabActivity';
export function onTabActivity(channelKey, handleTabActivity) {
    if (!IS_BROWSER)
        return () => undefined;
    let isMainTab = false;
    let mainAgainTimeoutId;
    const shouldThrottle = throttler(THROTTLE_DELAY * 2);
    const bc = window.BroadcastChannel
        ? new BroadcastChannel(BROADCAST_CHANNEL(channelKey))
        : new BroadcastChannelPolyfill(BROADCAST_CHANNEL(channelKey));
    bc.addEventListener('message', handleMessage);
    for (const evt of EVENTS) {
        if (evt === 'visibilitychange') {
            window.addEventListener(evt, handleVisibilityChange);
        }
        else {
            window.addEventListener(evt, handleActivity);
        }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    function handleMessage(evt) {
        if (evt.data === MSG.new_activity) {
            clearTimeout(mainAgainTimeoutId);
            isMainTab = false;
            handleTabActivity(new CustomEvent(TAB_ACTIVITY_EVENT_NAME, { detail: { isMainTab } }));
        }
        if (evt.data === MSG.need_main) {
            mainAgainTimeoutId = setTimeout(() => {
                isMainTab = true;
                handleTabActivity(new CustomEvent(TAB_ACTIVITY_EVENT_NAME, { detail: { isMainTab } }));
                bc.postMessage(MSG.new_activity);
            }, Math.floor(Math.random() * 200) * 10);
        }
    }
    function handleActivity() {
        clearTimeout(mainAgainTimeoutId);
        if (isMainTab)
            return;
        if (shouldThrottle())
            return;
        isMainTab = true;
        handleTabActivity(new CustomEvent(TAB_ACTIVITY_EVENT_NAME, { detail: { isMainTab } }));
        bc.postMessage(MSG.new_activity);
    }
    function handleVisibilityChange() {
        if (document.visibilityState === 'visible')
            handleActivity();
    }
    function handleBeforeUnload() {
        if (isMainTab)
            bc.postMessage(MSG.need_main);
    }
    function cleanUp() {
        for (const evt of EVENTS) {
            if (evt === 'visibilitychange') {
                window.removeEventListener(evt, handleVisibilityChange);
            }
            else {
                window.removeEventListener(evt, handleActivity);
            }
        }
        window.removeEventListener('beforeunload', handleBeforeUnload);
        bc.removeEventListener('message', handleMessage);
        bc.close();
    }
    handleActivity();
    return cleanUp;
}
