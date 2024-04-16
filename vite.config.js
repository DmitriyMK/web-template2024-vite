import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";
import path from "path";
import { defineConfig } from "vite";
import glob from "fast-glob";
import { fileURLToPath } from "url";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
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
  ],
  build: {
    minify: false,
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync(["./*.html", "./pages/**/*.html"])
          .map((file) => [
            path.relative(__dirname, file.slice(0, file.length - path.extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      output: {
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(jpe?g|png|webp|avif|gif|svg)$/.test(name ?? '')) {
            return 'assets/img/[name].[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name].[hash][extname]';
          }
          if (/\.woff2$/.test(name ?? '')) {
            return 'assets/fonts/[name].[extname]';
          }
          return 'assets/[name].[extname]';
        },
      },
    },
  },
});
