import { defineConfig, searchForWorkspaceRoot } from 'vite'
import vue from '@vitejs/plugin-vue';
  
export default defineConfig({
  plugins: [vue()],
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        './node_modules/@mdi/font',
        './node_modules/@mdi/font/fonts',
        'C:/Users/Marcela/node_modules/@mdi/font',
        'C:\Users\Marcela\Documents\Projetos\pokedex\app',
      ],
    },
  },
  resolve: {
    alias: {
      '@mdi/font': '/node_modules/@mdi/font',
    },
  }
})