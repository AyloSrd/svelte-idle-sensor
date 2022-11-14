<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import { initializeIdleSensor } from '$lib/idle-sensor-store'
    import { EVENTS, FIFTEEN_MINUTES } from './utils';

    export let idleTimeout = FIFTEEN_MINUTES
	export let multitabSensor
	export let events = EVENTS
	export let reminderDuration = 0
	export let startManually = false

    const dispatch = createEventDispatcher()

    initializeIdleSensor({
        idleTimeout,
        multitabSensor,
        events,
        reminderDuration,
        startManually,
        onIdle: ({ detail }) => dispatch('idle', detail),
        onActive: ({ detail }) => dispatch('active', detail),
        onRemind: ({ detail }) => dispatch('remind', detail),
        onTabActivity: ({ detail }) => dispatch('tabActivity', detail)
    })
</script>

<style>
    span {
        display: none;
    }
</style>

<span />