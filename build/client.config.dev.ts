import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vitePlugins } from './utils/vitePlugins'
// https://vitejs.dev/config/
export default defineConfig({
  mode: `development`,
  plugins: vitePlugins,
  build: {
    target: `esnext`,
    outDir: path.resolve(__dirname, `../public`),
    emptyOutDir: false,
    watch: {
      exclude: `node_modules/**`,
      include: `src/**`,
    },
    sourcemap: true,
    manifest: true,
    rollupOptions: {
      input: {
        'main': path.resolve(__dirname, `../src/client/index.tsx`),
      },
      output: {
        entryFileNames: `[name].js`
      }
    }
  },
})
