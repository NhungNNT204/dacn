import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,  // Không tự động chuyển port nếu bị chiếm
    open: true,
    cors: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
