/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render } from "@testing-library/svelte";
import Counter from "./Counter.svelte";

describe("counter component", () => {
  test("should confirm there are no images in the counter ", () => {
    const { container } = render(Counter);
    expect(container).toContainHTML("");
  });
});