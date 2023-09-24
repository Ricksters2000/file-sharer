import vite from 'vite';
import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'

export const vitePlugins: Array<vite.PluginOption> = [
  react({
    jsxImportSource: `@emotion/react`,
    jsxRuntime: `automatic`,
    babel: {
      plugins: ['@emotion/babel-plugin'],
    },
  }),
  ssr(),
]