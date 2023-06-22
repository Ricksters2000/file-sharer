import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { vitePlugins } from './utils/vitePlugins'
// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => 
{
  const isProduction = mode === `production`;
  return {
    mode,
    plugins: vitePlugins,
    build: {
      outDir: path.resolve(__dirname, `../.dev`),
      watch: isProduction ? null : {
        exclude: `node_modules/**`,
        include: `src/**`,
      },
      sourcemap: !isProduction,
      minify: isProduction,
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
