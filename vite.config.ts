import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    viteCompression(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const module = id.split('node_modules/')[1].split('/')[0];
            
            const massiveLibraries = [
              'lucide-react', 
              'framer-motion', 
            ];
            if (massiveLibraries.includes(module)) {
              return module;
            }

            const largeDependencies = [
              '@supabase', 
              '@tanstack', 
              'react-router-dom', 
              'embla-carousel-react',
              'cmdk',
              '@radix-ui',
            ];
            if (largeDependencies.some(pkg => module.includes(pkg))) {
              return 'vendor';
            }
          }
        }
      }
    }
  }
}));
