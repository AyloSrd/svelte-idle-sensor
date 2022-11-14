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

`initializeIdleSensor` must be called inside a component, but you don't have to wrap it in the component's `onMount` function, as it will be manages internally by the sensor itself.

Initializing the sensor, will also activate the `start`, `stop` and `reset` functions (see [interact with the sensor](#interactions)). If you don't initialize the sensor, calling them will not work.

There can be only one sensor per application, therefore calling `initializeIdleSensor` or instantiating `<IdleSensor />` multiple times in the app, will result in a re-initialization of the same sensor, and not in several sensors running.
```svelte
// with initializeIdleSensor()
<script>
    import { initializeIdleSensor } from 'svelte-idle-sensor'

    initializeIdleSensor()
</script>

// with <IdleSensor />
<script>
    import { IdleSensor } from 'svelte-idle-sensor'
</script>
<IdleSensor />

```
### <a id="configuration"></a>Configure the sensor
The sensor come with a default configuration, which you can personalize on its initialization.
You can do it either via a configuration object passed as a parameter to `initializeIdleSensor`, or via optional props passed to `<IdleSensor />`.
The options, all of which is non-mandatory as they all have a default value, are:

- **idleTimeout**: `number`; time of user's inactivity in milliseconds before the idle status changes to idle. This time is extended by the `reminderDuration` option. Triggering any of the events observed by the sensor (see the option events below), will reset the timer. It defaults to 15 minutes.
- **reminderDuration**: `number`; additional time slot after the idle timer expires, before declaring the user idle and calling the idle callback. This is to meet the use case when we may want to prompt the user to check if they are still active before declaring them idle, or to remind them that they will be logged out shortly. Events triggered in this phase won't stop the timer, only the reset and stop methods will (see [interact with the sensor](#interactions)). It defaults to 0.
- **onIdle | on:idle**: `(idleEvt: CustomEvent<{ lastFiredEvent: Event }>) => void`; callback triggered when the user status passes to idle. When invoked, an `IdleEvent`, storing in its `detail` the last event fired before the reminding phase, will be passed as a parameter. Events fired in the prompt phase will not count. It defaults to an empty function.
- **onRemind | on:remind**: `(remindEvt: CustomEvent<{ lastFiredEvent: Event }>) => void`; when the `idleTimeout` expires, before declaring the idle status, the remind callback is fired, starting the reminder timer. When invoked, a `RemindEvent`, storing in its `detail` the last event fired before the reminding phase, will be passed as a parameter. It defaults to an empty function.
- **onActive | on:active**: `(activityEvt: CustomEvent<{ triggeringEvent: Event }>) => void`; callback called when the user resumes activity after having been idle (resuming from the reminding phase doesn't trigger `onActive`). An `ActivityEvent`, storing the event that triggered the return to activity in its `detail`, is passed as a parameter. It defaults to an empty function.
- **startManually**: `boolean`; requires the event-listeners to be bound manually by using the `start` method, instead of doing it automatically on the component's mount. It defaults to false.
- **events**: `EventTypeName[]`; a list of the DOM events that will be listened to in order to monitor the user's activity. The events must be of `EventTypeName` type (it can be imported). The list defaults to `['mousemove', 'keydown', 'wheel', 'resize', 'mousewheel', 'mousedown', 'pointerdown', 'touchstart', 'touchmove', 'visibilitychange']`
- **multitabSensor**: `boolean`; coordinates sensors open on different pages.

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
