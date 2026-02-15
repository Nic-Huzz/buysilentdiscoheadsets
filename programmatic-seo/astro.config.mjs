// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://buysilentdiscoheadsets.com',
  output: 'static',
  build: {
    format: 'directory', // /silent-disco-headphones-bali/ not .html
  },
  vite: {
    css: {
      preprocessorOptions: {}
    }
  }
});
