import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.dirname(__filename);
const distDir = path.resolve(rootDir, 'dist');
const distIndex = path.resolve(distDir, 'index.html');
const distServer = path.resolve(rootDir, 'dist-server', 'server.mjs');
const isDev = process.env.npm_lifecycle_event === 'dev';

process.env.BIOSFERA_ROOT_DIR = rootDir;

if (!isDev && !process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

// Fast-path for production (Hostinger / LiteSpeed / Passenger):
// Boot the pre-compiled dist/server.mjs directly with zero tsx/vite startup overhead.
if (!isDev && fs.existsSync(distServer) && fs.existsSync(distIndex)) {
  await import(pathToFileURL(distServer).href);
} else {
  // Fallback if postinstall/build did not run before startup
  if (!isDev && !fs.existsSync(distIndex)) {
    console.log('BIOSFERA: dist/index.html not found — building production assets with Vite...');
    const { build: buildClient } = await import('vite');
    await buildClient({ root: rootDir });
  }

  if (!isDev && !fs.existsSync(distServer)) {
    try {
      const { build: buildServer } = await import('esbuild');
      await buildServer({
        entryPoints: [path.resolve(rootDir, 'server.ts')],
        bundle: true,
        platform: 'node',
        format: 'esm',
        packages: 'external',
        outfile: distServer,
      });
    } catch (err) {
      console.warn('BIOSFERA: fallback esbuild server compile skipped:', err);
    }
  }

  if (!isDev && fs.existsSync(distServer)) {
    await import(pathToFileURL(distServer).href);
  } else {
    const { register } = await import('tsx/esm/api');
    register();
    await import(pathToFileURL(path.resolve(rootDir, 'server.ts')).href);
  }
}
