import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import svg from '@poppanator/sveltekit-svg';
import mkcert from 'vite-plugin-mkcert';
import fs from 'fs';

export default defineConfig({
  plugins: [sveltekit(), svg(), mkcert()],
  server: {
    fs: {
      allow: ['..']
    },
    proxy: {},
    https: {
      key: fs.readFileSync('./cert/dev.pem'),
      cert: fs.readFileSync('./cert/cert.pem')
    }
  }
});
