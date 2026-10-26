import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import quoteHandler from './api/order/quote';
import stkpushHandler from './api/mpesa/stkpush';
import queryHandler from './api/mpesa/query';
import callbackHandler from './api/mpesa/callback';

function devApiPlugin(): Plugin {
  return {
    name: 'dev-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const urlPath = req.url.split('?')[0];
        try {
          if (urlPath === '/api/order/quote') {
            await quoteHandler(req, res);
          } else if (urlPath === '/api/mpesa/stkpush') {
            await stkpushHandler(req, res);
          } else if (urlPath === '/api/mpesa/query') {
            await queryHandler(req, res);
          } else if (urlPath === '/api/mpesa/callback') {
            await callbackHandler(req, res);
          } else {
            next();
          }
        } catch (err: unknown) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: (err as Error).message }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), devApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

