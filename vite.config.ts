import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import svg from '@poppanator/sveltekit-svg';
import { webSocketServer } from './server/wsServer/wsServer';

export default defineConfig({
	plugins: [sveltekit(), svg(), webSocketServer]
});
