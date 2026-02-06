import { defineConfig } from 'wxt';
import path from 'path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: 'PDF Compressor',
    version: '1.2.0',
    description: 'Compress PDF files locally in your browser',
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
