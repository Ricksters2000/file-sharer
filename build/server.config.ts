import path from 'path'
import {defineConfig} from 'vite'
import {vitePlugins} from './utils/vitePlugins'
// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => 
{
  return {
    plugins: vitePlugins,
    build: {
      outDir: path.resolve(__dirname, `../dist/server`),
      watch: null,
      sourcemap: false,
      minify: false,
      manifest: true,
      ssr: true,
      rollupOptions: {
        input: {
          'server-ssr-entry': path.resolve(__dirname, `../src/server/serverSsrEntry.tsx`),
        },
        output: {
          entryFileNames: `[name].js`
        },
      },
    },
  }
})
