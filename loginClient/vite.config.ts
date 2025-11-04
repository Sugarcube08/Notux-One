import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
   server: {
    allowedHosts: ['caac701388de.ngrok-free.app'],
    // Optional: if you use ngrok for HTTPS tunneling
    host: true, 
  },
})