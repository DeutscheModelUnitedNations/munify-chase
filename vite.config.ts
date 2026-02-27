import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    devtoolsJson(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/lib/paraglide'
    })
  ],
  server: {
    proxy: {
      '/dmun-cdn': {
        target: 'https://dmuncdnstorage.blob.core.windows.net/cdn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dmun-cdn/, '')
      }
    }
  }
});
