import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), '..');

if (process.env.SKIP_POSTINSTALL_BUILD === 'true') {
  process.exit(0);
}

const hasViteConfig = fs.existsSync(path.join(rootDir, 'vite.config.ts'));
const hasEntry = fs.existsSync(path.join(rootDir, 'src', 'main.tsx'));

if (!hasViteConfig || !hasEntry) {
  process.exit(0);
}

try {
  const { build } = await import('vite');
  await build({ root: rootDir });
  console.log('BIOSFERA: dist/ production bundle built successfully.');
} catch (err) {
  console.error('BIOSFERA postinstall build warning:', err);
  process.exitCode = 1;
}
