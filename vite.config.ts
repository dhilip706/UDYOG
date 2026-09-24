import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'cinematic-video-server',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next();
          const cleanUrl = req.url.split('?')[0].toLowerCase();
          
          if (cleanUrl === '/laptop.mp4' || cleanUrl === '/mobile.mp4') {
            const fileName = cleanUrl === '/laptop.mp4' ? 'LAPTOP.mp4' : 'MOBILE.mp4';
            const filePath = path.resolve(__dirname, 'public', fileName);

            if (fs.existsSync(filePath)) {
              const stat = fs.statSync(filePath);
              const fileSize = stat.size;
              const range = req.headers.range;

              if (range) {
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunkSize = end - start + 1;
                const file = fs.createReadStream(filePath, { start, end });

                res.writeHead(206, {
                  'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                  'Accept-Ranges': 'bytes',
                  'Content-Length': chunkSize,
                  'Content-Type': 'video/mp4',
                  'Cache-Control': 'public, max-age=31536000',
                });
                file.pipe(res);
                return;
              } else {
                res.writeHead(200, {
                  'Content-Length': fileSize,
                  'Content-Type': 'video/mp4',
                  'Accept-Ranges': 'bytes',
                  'Cache-Control': 'public, max-age=31536000',
                });
                fs.createReadStream(filePath).pipe(res);
                return;
              }
            }
          }
          next();
        });
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
    watch: {
      ignored: ['**/vexyl-tts-main/**', '**/.venv/**', '**/scratch/**', '**/*.pyc', '**/dist/**'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
