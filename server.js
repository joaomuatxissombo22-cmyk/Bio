import fs from 'fs';
import path from 'path';
import { register } from 'tsx/esm/api';

const rootDir = process.cwd();
const distIndex = path.resolve(rootDir, 'dist', 'index.html');
const isDev = process.env.npm_lifecycle_event === 'dev';

// Safety net: if hosted on Hostinger with "Build command: none" and postinstall was skipped,
// compile the Vite production bundle once before starting Express so the site never renders blank.
if (!isDev && !fs.existsSync(distIndex)) {
  console.log('BIOSFERA: dist/index.html not found — building production assets with Vite...');
  const { build } = await import('vite');
  await build({ root: rootDir });
}

if (!isDev && !process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

register();
await import('./server.ts');
