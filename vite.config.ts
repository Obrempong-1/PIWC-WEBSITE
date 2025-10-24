import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "url";


const nonBlockingCssPlugin = () => {
  return {
    name: 'vite-plugin-non-blocking-css',
   
    enforce: 'post' as const,
    
    transformIndexHtml(html: string) {
      
      const cssRegex = /<link rel="stylesheet" [^>]*href="([^"]+\.css)"[^>]*>/;
      const match = html.match(cssRegex);

      if (!match) {
        return html; 
      }

      const cssUrl = match[1];
      const originalLinkTag = match[0];

      
      const newTags = `
        <link rel="preload" href="${cssUrl}" as="style">
        <link rel="stylesheet" href="${cssUrl}" media="print" onload="this.media='all'">
        <noscript><link rel="stylesheet" href="${cssUrl}"></noscript>
      `;

     
      return html.replace(originalLinkTag, newTags);
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nonBlockingCssPlugin(),
  ],
  resolve: {
    alias: {
     
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
 
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const module = id.split('node_modules/')[1].split('/')[0];
            const massiveLibraries = ['lucide-react', 'framer-motion'];
            if (massiveLibraries.includes(module)) {
              return module;
            }
          }
        }
      }
    }
  }
});
