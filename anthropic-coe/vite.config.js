import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use relative base so the build can be served from any sub-path
// (GitHub Pages, static hosting, file preview, etc.)
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
