import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
  build: { outDir: process.env.BUILD_OUTDIR ?? 'dist' },
  server: { port: 5180 },
})
