import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path";
//import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    //host: '0.0.0.0', // Allow external access
    host:'localhost',
    port: 3000,
    hmr:true
    // https: {
    //   key: fs.readFileSync('key.pem'), // Specify the private key file path
    //   cert: fs.readFileSync('cert.pem'), // Specify the certificate file path
    // },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 将 @ 指向 src
    },
  },
})
