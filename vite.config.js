import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/ai-security-stack-matrix/', // This line is critical for GitHub Pages
  plugins: [
    react(),
    tailwindcss(),
  ],
})