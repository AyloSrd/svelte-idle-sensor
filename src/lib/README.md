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
    import { initializeIdleSensor } from 'svelte-idle-sensor'

    const { idle, reminding, reset } = initializeIdleSensor({
        idleTimeout: 600_000,
        multitabSensor: true,
        reminderDuration: 120_000,
        onTabActivity: ({ detail: { isMainTab } }) =>
            isMainTab
                ? resumeExpensiveComputation()
                : pauseExpensiveComputation()
    })
</script>

{#if $idle}
    <LogoutPage />
{:else if $reminding}
    <AreYouStillTherePopup on:confirm={reset}>
{:else}
    <HomePage />
{/if}
```
## Initialize the sensor
You can start the sensor either by calling `initializeIdleSensor`, or by using the `<IdleSensor />` component. Generally, the initialized sensor will start onMount, unless you have set `startManually` to` true` in the configuration object (see [configuration](#configuration)).
## <a id="configuration"></a>Configure the sensor
You can start the sensor either by calling `initializeIdleSensor`, or by using the `<IdleSensor />` component. Generally, the initialized sensor will start onMount, unless you have set `startManually` to` true` in the configuration object (see [configuration](#configuration)).
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
