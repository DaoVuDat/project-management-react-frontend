import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import {TanStackRouterVite} from '@tanstack/router-vite-plugin';
import path from 'path';
import {ViteImageOptimizer} from 'vite-plugin-image-optimizer';
import mdx from '@mdx-js/rollup'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {enforce: 'pre', ...mdx(),},
    react(),
    ViteImageOptimizer({
      svg: {
        multipass: true,
        plugins: [
          'cleanupIds',
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false, // https://github.com/svg/svgo/issues/1128
              },
            },
          },
          'sortAttrs',
          {
            name: 'addAttributesToSVGElement',
            params: {
              attributes: [{xmlns: 'http://www.w3.org/2000/svg'}],
            },
          },
        ],
      },
    }),
    TanStackRouterVite(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'happy-dom', // for web env testing ( default node )
  },
});
