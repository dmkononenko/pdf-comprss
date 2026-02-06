import { defineConfig } from 'wxt';
import path from 'path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: 'PDF Compress - Local Tool',
    version: '1.2.0',
    description: 'PDF compress tool that works locally. No server upload. Compress PDF files 50-80% instantly. Private, fast, secure.',
    action: {
      default_title: 'Open PDF Compressor',
    },
    side_panel: {
      default_path: 'sidepanel.html',
    },
    permissions: ['sidePanel'],
    web_accessible_resources: [
      {
        resources: ['pdf.worker.mjs'],
        matches: ['<all_urls>'],
      },
    ],
  },
  vite: () => ({
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
        '@': path.resolve(__dirname, './src'),
      },
    },
  }),
});
