<p>
  <img width="100%" src="../../svelte-log.png" alt="Svelte idle-sensor logo">
</p>

# Svelte idle-sensor

A Svelte library to track the user's idle status and react to its changes.

## Installation

```bash
npm install svelte-idle-sensor
# or
yarn add svelte-idle-sensor
# or
pnpm add svelte-idle-sensor
```

## Basic Example
```svelte
<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import { idle, initializeIdleSensor } from '$lib'

    const dispatch = createEventDispatcher()
    let show = true
    let status = 'initial'
    let tab = ''

    initializeIdleSensor({
        idleTimeout: 500,
        multitabSensor: true,
        events: ['click'],
        reminderDuration: 500,
        onIdle: () => status = 'idle',
        onActive: () => status = 'active',
        onRemind: () => status = 'reminding',
        onTabActivity: ({ detail: { isMainTab } }) => tab = isMainTab ? 'main tab' : 'secondary tab',
    })
</script>
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
