import { sveltekit } from '@sveltejs/kit/vite';
// import type { UserConfig } from 'vite';

const config = {
	plugins: [sveltekit()],
    test: {
        // Jest like globals
        globals: true,
        environment: 'jsdom',
        include: ['src/**/*.{test,spec}.ts'],
        // Extend jest-dom matchers
        setupFiles: ['./setupTest.js']
      }
};

export default config;
