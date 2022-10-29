<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import { idle, initializeIdleSensor } from '$lib'
    import Widget from '../test/Widget.svelte'

    const dispatch = createEventDispatcher()
    let show = true
    // let status = 'initial'

    // initializeIdleSensor({
    //     idleTimeout: 500,
    //     crosstab: true,
    //     events: ['click'],
    //     reminderDuration: 500,
    //     onIdle: () => status = 'idle',
    //     onActive: () => status = 'active',
    //     onRemind: () => status = 'reminding',
    //     onTabActivity: ({ detail: { isMainTab } }) => status = isMainTab ? 'main tab' : 'secondary tab',
    // })
</script>

<div>
    {$idle}
</div>
<button on:click={() => show = false}>
    remove
</button>
{#if show}
    <Widget />
{/if}