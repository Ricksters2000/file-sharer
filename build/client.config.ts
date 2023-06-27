import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vitePlugins } from './utils/vitePlugins'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: vitePlugins,
  build: {
    target: `esnext`,
    outDir: path.resolve(__dirname, `../dist/client`),
    emptyOutDir: false,
    watch: null,
    sourcemap: false,
    manifest: true,
    minify: `esbuild`,
    rollupOptions: {
      input: {
        'main': path.resolve(__dirname, `../index.html`),
      },
      output: {
        entryFileNames: `[name].js`
      }
    }
  },
})
