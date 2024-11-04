import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Allow external access
    port: 3000,
    // https: {
    //   key: fs.readFileSync('key.pem'), // Specify the private key file path
    //   cert: fs.readFileSync('cert.pem'), // Specify the certificate file path
    // },
  },
  plugins: [
    react()
  ],
})
