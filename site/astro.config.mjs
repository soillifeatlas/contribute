import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://soillifeatlas.org',
  base: '/contribute',
  trailingSlash: 'always',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/contribute/api': {
          target: 'http://127.0.0.1:8010',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/contribute\/api/, '/api')
        }
      }
    }
  },
  output: 'static'
});
