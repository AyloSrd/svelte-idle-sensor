export type IdleEvent = CustomEvent<{ lastFiredEvent: Event }>
export type ActivityEvent = CustomEvent<{ triggeringEvent: Event }>
export type RemindEvent = IdleEvent
export type TabActivityEvent = CustomEvent<{ isMainTab: boolean }>

export type EventTypeName = keyof DocumentEventMap
export const EVENTS: EventTypeName[] = [
    'mousemove',
    'keydown',
    'wheel',
    'resize',
    'wheel',
    'mousedown',
    'pointerdown',
    'touchstart',
    'touchmove',
    'visibilitychange'
]

export const FIFTEEN_MINUTES = 900_000 // 15 minutes
export const THROTTLE_DELAY = 250
export const IS_BROWSER: boolean =
    typeof window !== 'undefined'
    && typeof document !== 'undefined'

export function throttler(delay: number) {
    let lastThrottle = 0

    function throttle() {
        const now = new Date().getTime()
        const shouldThrottle = now - lastThrottle < delay
        if (!shouldThrottle) lastThrottle = now

        return shouldThrottle
    }

    return throttle
}