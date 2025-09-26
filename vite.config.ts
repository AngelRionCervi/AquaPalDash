import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import svg from '@poppanator/sveltekit-svg';
import fs from 'fs';

export default defineConfig(() => {
  if (process.env.NODE_ENV === 'development') {
    return {
      plugins: [sveltekit(), svg()],
      server: {
        fs: {
          allow: ['..']
        },
        proxy: {},
        https: {
          key: fs.readFileSync('./cert/dev.pem'),
          cert: fs.readFileSync('./cert/cert.pem')
        },
        port: 4359
      }
    };
  } else {
    return {
      plugins: [sveltekit(), svg()],
      server: {
        fs: {
          allow: ['..']
        }
      }
    };
  }
});
