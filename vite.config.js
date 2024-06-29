import { resolve } from 'path';
import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import handlebars from 'vite-plugin-handlebars';
import glsl from 'vite-plugin-glsl';

const pageData = {
  '/index.html': {
    title: 'lalaland',
    path: resolve(__dirname),
  },
  '/pages/about/index.html': {
    title: 'hellooooooo',
    path: resolve(__dirname, './src/pages/about/index.html'),
  },
};

export default defineConfig({
  root: './src',
  server: {
    port: 8100,
    open: false,
  },
  css: {
    devSourcemap: true,
  },
  plugins: [
    ViteImageOptimizer({
      png: {
        quality: 86,
      },
      jpeg: {
        quality: 86,
      },
      jpg: {
        quality: 86,
      },
      avif: {
        quality: 86,
      }
    }),
    {
      ...imagemin(["./src/img/**/*.{jpg,png,jpeg}"], {
        destination: "./src/img/minify/",
        plugins: [imageminWebp({ quality: 86 })],
      }),
      apply: "serve",
    },
    handlebars({
      partialDirectory: resolve(__dirname, './src/components'),
      context(pagePath) {
        return pageData[pagePath];
      },
    }),
    glsl(),
  ],
  build: {
    outDir: '../build',
    rollupOptions: {
      input: {
        index: resolve(__dirname, './src/index.html'),
        about: resolve(__dirname, './src/pages/about/index.html'),
      },
      output: {
        // chunkFileNames: 'assets/js/[name].[hash].js',
        // entryFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(jpe?g|png|webp|avif|gif|svg)$/.test(name ?? '')) {
            return 'assets/img/[name].[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name].[hash][extname]';
          }
          if (/\.woff2$/.test(name ?? '')) {
            return 'assets/fonts/[name][extname]';
          }
          return 'assets/[name].[extname]';
        },
      },
    },
  },
});
