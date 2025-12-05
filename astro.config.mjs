import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://virajnpawar.github.io',
  base: process.env.NODE_ENV === 'production' ? '/ProjectShowcase' : '/',
  integrations: [react(), tailwind()],
});