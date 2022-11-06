<script>
    import { initializeIdleSensor } from '../../package/idle-sensor-store'

    let status = 'initial'
    let tab = 'initial'

    initializeIdleSensor({
        idleTimeout: 1000,
        detectTabActivity: true,
        events: ['click'],
        reminderDuration: 1000,
        onIdle: () => status = 'idle',
        onActive: () => status = 'active',
        onRemind: () => status = 'reminding',
        onTabActivity: ({ detail: { isMainTab } }) => tab = isMainTab ? 'main tab' : 'secondary tab',
    })
</script>

<div>
    {status}
</div>
<div>
    {tab}
</div>
