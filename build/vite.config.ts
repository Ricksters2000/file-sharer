import path from 'path'
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => 
{
  return {
    plugins: [
      react({
        jsxImportSource: `@emotion/react`,
        jsxRuntime: `automatic`,
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
      ssr(),
    ]
  }
})
