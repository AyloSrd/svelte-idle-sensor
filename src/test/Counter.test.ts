import { render, fireEvent, screen } from '@testing-library/svelte';
import Counter from '$lib/Counter.svelte';

describe('Test Counter.svelte', async () => {
  it('Initial counter should be 0', async () => {
    render(Counter);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
  it('Test increase', async () => {
    render(Counter);
    const increaseButton = screen.getByText('+');
    // Increase by one
    await fireEvent.click(increaseButton);
    // Wait for animation
    const counter = await screen.findByText('1');
    expect(counter).toBeInTheDocument();
  });
});