import vite from 'vite';
import react from '@vitejs/plugin-react'

export const vitePlugins: Array<vite.PluginOption> = [
  react({
    jsxImportSource: `@emotion/react`,
    babel: {
      plugins: ['@emotion/babel-plugin'],
    },
  }),
]