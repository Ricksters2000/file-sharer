import path from 'path'
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    ssr: true,
    rollupOptions: {
      input: path.resolve(__dirname, `./src/server/entry.ts`),
    }
  },
  server: {
    origin: `http://localhost:5173`
  }
})
