import { render, fireEvent, screen } from '@testing-library/svelte';
import Widget from './Widget.svelte';
import { idle, reminding, reset } from '../../package/idle-sensor-store'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('idle-sensor-store', async () => {
    it('State should be set to reminding after 1s', async () => {
        render(Widget);
        let remindingRef = false
        reminding.subscribe(res => remindingRef = res)

        expect(remindingRef).toBe(false)

        await sleep(1200)
        expect(screen.getByText('reminding')).toBeInTheDocument();
        expect(remindingRef).toBe(true)

        const componentRef = screen.getByText('reminding')
        await fireEvent.click(componentRef);

        expect(screen.getByText('reminding')).toBeInTheDocument();
        expect(remindingRef).toBe(true)

        await sleep(1200)
        expect(() =>screen.getByText('reminding')).toThrow();
        expect(remindingRef).toBe(false)
    });

    it('reset should interrupt reminding phase', async () => {
        render(Widget);
        let remindingRef = false
        reminding.subscribe(res => remindingRef = res)

        expect(remindingRef).toBe(false)

        await sleep(1100)
        expect(screen.getByText('reminding')).toBeInTheDocument();
        expect(remindingRef).toBe(true)


        reset()
        await sleep(100)
        expect(remindingRef).toBe(false)
    });

    it('state goes idle after 2s', async () => {
        render(Widget);
        let idleRef = false
        idle.subscribe(res => idleRef = res)

        expect(idleRef).toBe(false)

        await sleep(2200)
        expect(screen.getByText('idle')).toBeInTheDocument();
        expect(idleRef).toBe(true)

        const componentRef = screen.getByText('idle')

        await fireEvent.keyDown(componentRef, {key: 'A', code: 'KeyA'})
        expect(screen.getByText('idle')).toBeInTheDocument();
        expect(idleRef).toBe(true)

        await fireEvent.click(componentRef);
        expect(screen.getByText('active')).toBeInTheDocument();
        expect(idleRef).toBe(false)
    });
})
