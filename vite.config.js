import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',  // GitHub Pages 호환을 위해 상대 경로
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 2000,  // App.jsx가 크므로 경고 임계값 상향
  },
  server: {
    port: 5173,
    host: true,
  },
})
