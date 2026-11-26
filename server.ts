import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerBiosferaApp, registerStaticFrontendAndErrors } from './server-app.js';

const __filename = fileURLToPath(import.meta.url);
const ROOT_DIR = path.dirname(__filename);

const rawPort = process.env.PORT?.trim();
const PORT: number | string =
  rawPort && /^\d+$/.test(rawPort) ? Number(rawPort) : rawPort || 3000;

async function startServer() {
  const app = express();
  registerBiosferaApp(app, ROOT_DIR);

  const distIndex = path.resolve(ROOT_DIR, 'dist', 'index.html');
  const isDevLifecycle = process.env.npm_lifecycle_event === 'dev';
  const isProduction =
    process.env.NODE_ENV === 'production' || (!isDevLifecycle && fs.existsSync(distIndex));

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use(
      (
        err: unknown,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction
      ) => {
        if (err instanceof SyntaxError && 'body' in err) {
          return res.status(400).json({ error: 'Formato JSON inválido.' });
        }
        console.error('Erro não tratado no servidor:', err);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
      }
    );
  } else {
    registerStaticFrontendAndErrors(app, ROOT_DIR);
  }

  const onListening = () => {
    console.log(`BIOSFERA server listening on ${PORT}`);
  };

  const server =
    typeof PORT === 'string' || isProduction
      ? app.listen(PORT, onListening)
      : app.listen(PORT, '0.0.0.0', onListening);

  server.on('error', (err) => {
    console.error('BIOSFERA server listen error:', err);
  });
}

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

startServer().catch((err) => {
  console.error('Fatal error starting BIOSFERA server:', err);
  process.exitCode = 1;
});
