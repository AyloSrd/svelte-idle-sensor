<script>
    import { createEventDispatcher } from 'svelte'
    import { initializeIdleSensor } from '../../package'

    const dispatch = createEventDispatcher()

    let status = 'initial'

    initializeIdleSensor({
        idleTimeout: 500,
        crosstab: true,
        events: ['click'],
        reminderDuration: 500,
        onIdle: () => status = 'idle',
        onActive: () => status = 'active',
        onRemind: () => status = 'reminding',
        onTabActivity: ({ detail: { isMainTab } }) => status = isMainTab ? 'main tab' : 'secondary tab',
    })
</script>

<div>
    {status}
</div>
