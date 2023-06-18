import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { vitePlugins } from './utils/vitePlugins'
// https://vitejs.dev/config/
export default defineConfig(() => 
{
  return {
    mode: `development`,
    plugins: vitePlugins,
    build: {
      outDir: path.resolve(__dirname, `../.dev`),
      watch: {
        exclude: `node_modules/**`,
        include: `src/**`,
      },
      sourcemap: true,
      manifest: true,
      ssr: true,
      rollupOptions: {
        input: {
          'server.dev': path.resolve(__dirname, `../src/server/index.ts`),
        },
        output: {
          entryFileNames: `[name].js`
        },
      },
    },
  }
})
