import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    plugins: [react()],
    base: env.VITE_BASE ?? '/',
    build: { outDir: env.BUILD_OUTDIR || 'dist' },
    server: { port: 5180 },
  }
})
