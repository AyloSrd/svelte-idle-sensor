<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import { idle, initializeIdleSensor } from '$lib'

    const dispatch = createEventDispatcher()
    let show = true
    let status = 'initial'
    let tab = ''

    initializeIdleSensor({
        idleTimeout: 500,
        detectTabActivity: true,
        events: ['click'],
        reminderDuration: 500,
        onIdle: () => status = 'idle',
        onActive: () => status = 'active',
        onRemind: () => status = 'reminding',
        onTabActivity: ({ detail: { isMainTab } }) => tab = isMainTab ? 'main tab' : 'secondary tab',
    })
</script>

<div>
    {$idle}
</div>
<div>
    {tab}
</div>
<button on:click={() => show = false}>
    remove
</button>
