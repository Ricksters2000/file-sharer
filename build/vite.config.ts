import path from 'path'
import {defineConfig} from 'vite'
import {vitePlugins} from './utils/vitePlugins'
// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => 
{
  return {
    plugins: vitePlugins,
  }
})
