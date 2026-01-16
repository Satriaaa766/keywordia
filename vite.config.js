import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

import { webSocketServer } from './src/lib/server/webSocketPlugin.js';

export default defineConfig({
	plugins: [sveltekit(), webSocketServer]
});
