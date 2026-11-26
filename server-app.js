'use strict';

const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const dotenv = require('dotenv');

const DEFAULT_PORTAL_KEY = 'biosfera-portal-7f9a';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

const MIME_TO_EXTENSIONS = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/webp': ['.webp'],
};

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.webp']);
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

const OFFICIAL_PORTAL_HOSTS = new Set([
  'minamb.gov.ao',
  'www.minamb.gov.ao',
  'anr.gov.ao',
  'www.anr.gov.ao',
]);

function ensureWritableDir(preferredDir, fallbackName) {
  try {
    if (!fs.existsSync(preferredDir)) {
      fs.mkdirSync(preferredDir, { recursive: true });
    }
    fs.accessSync(preferredDir, fs.constants.W_OK);
    return preferredDir;
  } catch (err) {
    const fallbackDir = path.join(os.tmpdir(), fallbackName);
    try {
      if (!fs.existsSync(fallbackDir)) {
        fs.mkdirSync(fallbackDir, { recursive: true });
      }
      console.warn(`Aviso: usando diretório temporário ${fallbackDir}:`, err);
      return fallbackDir;
    } catch {
      return preferredDir;
    }
  }
}

function createRateLimiter(maxRequests, windowMs) {
  const store = new Map();
  const MAX_ENTRIES = 2000;

  const prune = (now) => {
    if (store.size < MAX_ENTRIES) return;
    for (const [k, v] of store.entries()) {
      if (now > v.resetAt) store.delete(k);
    }
    while (store.size >= MAX_ENTRIES) {
      const oldestKey = store.keys().next().value;
      if (!oldestKey) break;
      store.delete(oldestKey);
    }
  };

  return {
    check(key, customMax = maxRequests) {
      const now = Date.now();
      const entry = store.get(key);
      if (!entry || now > entry.resetAt) {
        prune(now);
        store.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }
      if (entry.count >= customMax) return false;
      entry.count += 1;
      return true;
    },
    isBlocked(key) {
      const entry = store.get(key);
      if (!entry) return false;
      if (Date.now() > entry.resetAt) {
        store.delete(key);
        return false;
      }
      return entry.count >= maxRequests;
    },
    recordFailure(key) {
      const now = Date.now();
      const entry = store.get(key);
      if (!entry || now > entry.resetAt) {
        prune(now);
        store.set(key, { count: 1, resetAt: now + windowMs });
      } else {
        entry.count += 1;
      }
    },
    clear(key) {
      store.delete(key);
    },
  };
}

function hasValidMagicBytes(buffer, ext) {
  if (buffer.length < 4) return false;
  switch (ext) {
    case '.pdf':
      return buffer.subarray(0, 5).toString('ascii') === '%PDF-';
    case '.png':
      return (
        buffer.length >= 8 &&
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a
      );
    case '.jpg':
    case '.jpeg':
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case '.webp':
      return (
        buffer.length >= 12 &&
        buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
        buffer.subarray(8, 12).toString('ascii') === 'WEBP'
      );
    case '.doc':
      return (
        buffer.length >= 8 &&
        buffer[0] === 0xd0 &&
        buffer[1] === 0xcf &&
        buffer[2] === 0x11 &&
        buffer[3] === 0xe0
      );
    case '.docx':
      return (
        buffer[0] === 0x50 &&
        buffer[1] === 0x4b &&
        (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07) &&
        (buffer[3] === 0x04 || buffer[3] === 0x06 || buffer[3] === 0x08)
      );
    default:
      return false;
  }
}

function sanitizeFilename(rawName) {
  const base = path.basename(rawName).replace(/[^a-zA-Z0-9._-]/g, '_');
  const ext = path.extname(base).toLowerCase();
  const safeExt = ALLOWED_EXTENSIONS.has(ext) ? ext : '.bin';
  const stem = path.basename(base, path.extname(base)).slice(0, 60) || 'documento';
  return `${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${stem}${safeExt}`;
}

function isPrivateOrRestrictedHost(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (
    host === 'localhost' ||
    host === '0.0.0.0' ||
    host === '::1' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.endsWith('.localhost')
  ) {
    return true;
  }
  const ipv4Match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const a = Number(ipv4Match[1]);
    const b = Number(ipv4Match[2]);
    if (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127)
    ) {
      return true;
    }
  }
  if (host.includes(':')) {
    if (
      host === '::' ||
      host === '::1' ||
      host.startsWith('fc') ||
      host.startsWith('fd') ||
      host.startsWith('fe80') ||
      host.startsWith('::ffff:')
    ) {
      return true;
    }
  }
  return false;
}

function sanitizeExternalHttpsUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'https:') return '';
    if (parsed.username || parsed.password || parsed.port) return '';
    if (isPrivateOrRestrictedHost(parsed.hostname)) return '';
    return parsed.toString();
  } catch {
    return '';
  }
}

async function safeFetchHttps(initialUrl, options = {}) {
  const { allowedHosts, requiredPathPrefix, timeoutMs = 7500, accept } = options;
  let currentUrl = initialUrl;

  for (let hop = 0; hop <= 2; hop += 1) {
    let parsed;
    try {
      parsed = new URL(currentUrl);
    } catch {
      return null;
    }
    const hostLower = parsed.hostname.toLowerCase();
    if (
      parsed.protocol !== 'https:' ||
      parsed.username ||
      parsed.password ||
      parsed.port ||
      isPrivateOrRestrictedHost(hostLower)
    ) {
      return null;
    }
    if (allowedHosts && !allowedHosts.has(hostLower)) {
      return null;
    }
    if (requiredPathPrefix && !parsed.pathname.startsWith(requiredPathPrefix)) {
      return null;
    }

    const response = await fetch(parsed.toString(), {
      headers: {
        'User-Agent': 'BIOSFERA-Consultoria-Portal/1.0 (+https://biosfera.ao)',
        Accept: accept || 'text/html,application/xhtml+xml,application/xml;q=0.9',
      },
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) return null;
      try {
        currentUrl = new URL(location, parsed).toString();
      } catch {
        return null;
      }
      continue;
    }

    return response;
  }

  return null;
}

function decodeHtmlEntities(input) {
  const named = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&aacute;': 'á',
    '&Aacute;': 'Á',
    '&agrave;': 'à',
    '&Agrave;': 'À',
    '&acirc;': 'â',
    '&Acirc;': 'Â',
    '&atilde;': 'ã',
    '&Atilde;': 'Ã',
    '&eacute;': 'é',
    '&Eacute;': 'É',
    '&ecirc;': 'ê',
    '&Ecirc;': 'Ê',
    '&iacute;': 'í',
    '&Iacute;': 'Í',
    '&oacute;': 'ó',
    '&Oacute;': 'Ó',
    '&ocirc;': 'ô',
    '&Ocirc;': 'Ô',
    '&otilde;': 'õ',
    '&Otilde;': 'Õ',
    '&uacute;': 'ú',
    '&Uacute;': 'Ú',
    '&ccedil;': 'ç',
    '&Ccedil;': 'Ç',
    '&ordm;': 'º',
    '&ordf;': 'ª',
    '&ldquo;': '“',
    '&rdquo;': '”',
    '&lsquo;': '‘',
    '&rsquo;': '’',
    '&ndash;': '–',
    '&mdash;': '—',
    '&hellip;': '…',
  };
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/&#(\d+);/g, (_m, dec) => {
      const code = Number(dec);
      return code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, hex) => {
      const code = parseInt(hex, 16);
      return code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
    })
    .replace(/&[a-zA-Z]+;/g, (entity) => named[entity] ?? entity)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dateToSortKey(ddmmyyyy) {
  const m = ddmmyyyy.match(/(\d{2})-(\d{2})-(\d{4})/);
  if (!m) return 0;
  return Number(`${m[3]}${m[2]}${m[1]}`);
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function ddmmyyyyToRfc822(ddmmyyyy) {
  const m = ddmmyyyy.match(/(\d{2})-(\d{2})-(\d{4})/);
  if (!m) return new Date().toUTCString();
  const d = new Date(Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1]), 12, 0, 0));
  return Number.isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

function registerBiosferaApp(app, rootDir) {
  dotenv.config({ path: path.resolve(rootDir, '.env'), quiet: true });

  const UPLOADS_DIR = ensureWritableDir(
    path.resolve(rootDir, 'public', 'uploads'),
    'biosfera-uploads'
  );
  const DATA_DIR = ensureWritableDir(path.resolve(rootDir, '.biosfera-data'), 'biosfera-data');
  const AUTH_FILE = path.resolve(DATA_DIR, 'portal-auth.json');
  const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString('hex');

  function readStoredAuth() {
    try {
      if (!fs.existsSync(AUTH_FILE)) return {};
      const raw = fs.readFileSync(AUTH_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  }

  function writeStoredAuth(next) {
    fs.writeFileSync(AUTH_FILE, JSON.stringify(next, null, 2), { encoding: 'utf8', mode: 0o600 });
  }

  function getEffectiveAccessKey() {
    const envKey = process.env.ADMIN_ACCESS_KEY?.trim();
    if (envKey) return envKey;
    const stored = readStoredAuth();
    if (typeof stored.accessKey === 'string' && stored.accessKey.trim()) {
      return stored.accessKey.trim();
    }
    return DEFAULT_PORTAL_KEY;
  }

  function safeEqualStrings(a, b) {
    const digestA = crypto.createHmac('sha256', SESSION_SECRET).update(a, 'utf8').digest();
    const digestB = crypto.createHmac('sha256', SESSION_SECRET).update(b, 'utf8').digest();
    return crypto.timingSafeEqual(digestA, digestB);
  }

  function hashPassword(password, saltHex) {
    return crypto.scryptSync(password, saltHex, 64).toString('hex');
  }

  function verifyPasswordHash(password, saltHex, expectedHex) {
    try {
      const derived = crypto.scryptSync(password, saltHex, 64);
      const expected = Buffer.from(expectedHex, 'hex');
      if (derived.length !== expected.length || expected.length === 0) return false;
      return crypto.timingSafeEqual(derived, expected);
    } catch {
      return false;
    }
  }

  function signAdminToken(username) {
    const payload = {
      sub: username,
      iat: Date.now(),
      exp: Date.now() + SESSION_TTL_MS,
    };
    const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
    const sig = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
    return `${encoded}.${sig}`;
  }

  function verifyAdminToken(token) {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encoded, sig] = parts;
    if (!encoded || !sig) return null;
    const expectedSig = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(encoded)
      .digest('base64url');
    if (!safeEqualStrings(sig, expectedSig)) return null;
    try {
      const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
      if (typeof parsed.sub !== 'string' || typeof parsed.exp !== 'number') return null;
      if (Date.now() > parsed.exp) return null;
      return { username: parsed.sub };
    } catch {
      return null;
    }
  }

  const loginLimiter = createRateLimiter(10, 15 * 60 * 1000);
  const adminProbeLimiter = createRateLimiter(30, 15 * 60 * 1000);
  const uploadLimiter = createRateLimiter(10, 15 * 60 * 1000);
  const notifyLimiter = createRateLimiter(20, 15 * 60 * 1000);
  const articleProxyLimiter = createRateLimiter(30, 5 * 60 * 1000);

  function getClientIp(req) {
    return req.ip || req.socket?.remoteAddress || 'unknown';
  }

  function getVerifiedAdminFromRequest(req) {
    const authHeader = req.headers.authorization;
    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.slice('Bearer '.length).trim();
    return verifyAdminToken(token);
  }

  function requireAdminBearer(req, res, next) {
    const verified = getVerifiedAdminFromRequest(req);
    if (!verified) {
      return res.status(401).json({ error: 'Sessão administrativa inválida ou expirada.' });
    }
    req.adminUser = verified.username;
    return next();
  }

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // Baseline security headers (iframe-compatible; omits X-Frame-Options)
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  // In-memory cached icon-only favicon routes (zero disk I/O per request, instant 304/200)
  const memoryAssetCache = new Map();
  function registerCachedIconRoute(routePath, contentType, candidatePaths) {
    app.get(routePath, (req, res) => {
      let cached = memoryAssetCache.get(routePath);
      if (!cached) {
        const existing = candidatePaths.find((p) => fs.existsSync(p));
        if (existing) {
          try {
            const buffer = fs.readFileSync(existing);
            const etag = `"${crypto.createHash('sha1').update(buffer).digest('hex').slice(0, 16)}"`;
            cached = { buffer, etag };
            memoryAssetCache.set(routePath, cached);
          } catch {
            cached = null;
          }
        }
      }
      if (!cached) {
        return res.status(204).end();
      }
      res.setHeader('Cache-Control', 'public, max-age=2592000, stale-while-revalidate=86400');
      res.setHeader('ETag', cached.etag);
      if (req.headers['if-none-match'] === cached.etag) {
        return res.status(304).end();
      }
      res.type(contentType);
      return res.status(200).send(cached.buffer);
    });
  }

  registerCachedIconRoute('/favicon.ico', 'image/x-icon', [
    path.resolve(rootDir, 'public', 'favicon.ico'),
    path.resolve(rootDir, 'dist', 'favicon.ico'),
    path.resolve(process.cwd(), 'public', 'favicon.ico'),
  ]);
  registerCachedIconRoute('/favicon.png', 'image/png', [
    path.resolve(rootDir, 'public', 'favicon.png'),
    path.resolve(rootDir, 'dist', 'favicon.png'),
    path.resolve(process.cwd(), 'public', 'favicon.png'),
  ]);
  registerCachedIconRoute('/favicon-32x32.png', 'image/png', [
    path.resolve(rootDir, 'public', 'favicon-32x32.png'),
    path.resolve(rootDir, 'dist', 'favicon-32x32.png'),
    path.resolve(process.cwd(), 'public', 'favicon-32x32.png'),
  ]);
  registerCachedIconRoute('/apple-touch-icon.png', 'image/png', [
    path.resolve(rootDir, 'public', 'apple-touch-icon.png'),
    path.resolve(rootDir, 'dist', 'apple-touch-icon.png'),
    path.resolve(process.cwd(), 'public', 'apple-touch-icon.png'),
  ]);

  app.use('/api/admin', (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  app.use(express.json({ limit: '8mb' }));

  app.get('/api/admin/entry-status', (req, res) => {
    const clientIp = getClientIp(req);
    if (!adminProbeLimiter.check(clientIp)) {
      return res.status(429).json({ validLink: false, error: 'Demasiadas tentativas.' });
    }

    const key = typeof req.query.key === 'string' ? req.query.key.trim() : '';
    const activeKey = getEffectiveAccessKey();
    if (!key || !safeEqualStrings(key, activeKey)) {
      return res.status(200).json({ validLink: false });
    }

    const envPassword = process.env.ADMIN_PASSWORD?.trim();
    if (envPassword) {
      return res.status(200).json({
        validLink: true,
        needsSetup: false,
        envManaged: true,
      });
    }

    const stored = readStoredAuth();
    const hasClaimed = Boolean(stored.username && stored.salt && stored.passwordHash);
    return res.status(200).json({
      validLink: true,
      needsSetup: !hasClaimed,
      envManaged: false,
    });
  });

  app.post('/api/admin/claim', (req, res) => {
    const clientIp = getClientIp(req);
    if (loginLimiter.isBlocked(clientIp)) {
      return res.status(429).json({
        error: 'Demasiadas tentativas falhadas. Aguarde alguns minutos antes de tentar novamente.',
      });
    }

    const { accessKey, username, password } = req.body ?? {};
    if (
      typeof accessKey !== 'string' ||
      !safeEqualStrings(accessKey.trim(), getEffectiveAccessKey())
    ) {
      loginLimiter.recordFailure(clientIp);
      return res.status(403).json({ error: 'Link de acesso inválido.' });
    }

    if (process.env.ADMIN_PASSWORD?.trim()) {
      return res.status(403).json({
        error: 'As credenciais de administração são geridas pelas variáveis de ambiente.',
      });
    }

    const stored = readStoredAuth();
    if (stored.username && stored.salt && stored.passwordHash) {
      return res.status(403).json({
        error: 'O acesso administrativo já foi configurado. Inicie sessão com as suas credenciais.',
      });
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Utilizador e palavra-passe são obrigatórios.' });
    }

    const cleanUser = username.trim();
    if (cleanUser.length < 3 || cleanUser.length > 64 || /\s/.test(cleanUser)) {
      return res.status(400).json({
        error: 'O nome de utilizador deve ter entre 3 e 64 caracteres sem espaços.',
      });
    }
    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({
        error: 'A palavra-passe deve ter entre 8 e 128 caracteres.',
      });
    }

    try {
      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = hashPassword(password, salt);
      writeStoredAuth({
        username: cleanUser,
        salt,
        passwordHash,
        accessKey: stored.accessKey || DEFAULT_PORTAL_KEY,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      return res.status(500).json({
        error:
          'Não foi possível guardar as credenciais no servidor. Configure ADMIN_PASSWORD nas variáveis de ambiente.',
      });
    }

    loginLimiter.clear(clientIp);
    const token = signAdminToken(cleanUser);
    return res.status(201).json({
      token,
      username: cleanUser,
      accessKey: getEffectiveAccessKey(),
      envManaged: false,
    });
  });

  app.post('/api/admin/login', (req, res) => {
    const clientIp = getClientIp(req);
    if (loginLimiter.isBlocked(clientIp)) {
      return res.status(429).json({
        error: 'Demasiadas tentativas falhadas. Aguarde alguns minutos antes de tentar novamente.',
      });
    }

    const { accessKey, username, password } = req.body ?? {};
    if (
      typeof accessKey !== 'string' ||
      !safeEqualStrings(accessKey.trim(), getEffectiveAccessKey())
    ) {
      loginLimiter.recordFailure(clientIp);
      return res.status(403).json({ error: 'Link de acesso inválido.' });
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Credenciais inválidas.' });
    }

    const cleanUser = username.trim();
    const envPassword = process.env.ADMIN_PASSWORD?.trim();

    if (envPassword) {
      const envUser = process.env.ADMIN_USERNAME?.trim() || 'admin';
      const userOk = safeEqualStrings(cleanUser, envUser);
      const passOk = safeEqualStrings(password, envPassword);
      if (!userOk || !passOk) {
        loginLimiter.recordFailure(clientIp);
        return res.status(401).json({ error: 'Utilizador ou palavra-passe incorretos.' });
      }
      loginLimiter.clear(clientIp);
      return res.status(200).json({
        token: signAdminToken(envUser),
        username: envUser,
        accessKey: getEffectiveAccessKey(),
        envManaged: true,
      });
    }

    const stored = readStoredAuth();
    if (!stored.username || !stored.salt || !stored.passwordHash) {
      return res.status(400).json({ error: 'Acesso administrativo ainda não configurado.' });
    }

    const userOk = safeEqualStrings(cleanUser, stored.username);
    const passOk = verifyPasswordHash(password, stored.salt, stored.passwordHash);
    if (!userOk || !passOk) {
      loginLimiter.recordFailure(clientIp);
      return res.status(401).json({ error: 'Utilizador ou palavra-passe incorretos.' });
    }

    loginLimiter.clear(clientIp);
    return res.status(200).json({
      token: signAdminToken(stored.username),
      username: stored.username,
      accessKey: getEffectiveAccessKey(),
      envManaged: false,
    });
  });

  app.get('/api/admin/session', requireAdminBearer, (req, res) => {
    const adminUser = req.adminUser || 'admin';
    return res.status(200).json({
      authenticated: true,
      username: adminUser,
      accessKey: getEffectiveAccessKey(),
      envManaged: Boolean(process.env.ADMIN_PASSWORD?.trim()),
      accessKeyEnvManaged: Boolean(process.env.ADMIN_ACCESS_KEY?.trim()),
    });
  });

  app.post('/api/admin/rotate-link', requireAdminBearer, (_req, res) => {
    if (process.env.ADMIN_ACCESS_KEY?.trim()) {
      return res.status(400).json({
        error: 'O link de acesso é definido pela variável de ambiente ADMIN_ACCESS_KEY.',
      });
    }
    try {
      const stored = readStoredAuth();
      const newKey = `biosfera-${crypto.randomBytes(6).toString('hex')}`;
      writeStoredAuth({
        ...stored,
        accessKey: newKey,
        updatedAt: new Date().toISOString(),
      });
      return res.status(200).json({ accessKey: newKey });
    } catch {
      return res.status(500).json({ error: 'Não foi possível actualizar o link de acesso.' });
    }
  });

  app.post('/api/admin/update-credentials', requireAdminBearer, (req, res) => {
    const clientIp = getClientIp(req);
    if (loginLimiter.isBlocked(clientIp)) {
      return res.status(429).json({
        error: 'Demasiadas tentativas falhadas. Aguarde alguns minutos antes de tentar novamente.',
      });
    }

    if (process.env.ADMIN_PASSWORD?.trim()) {
      return res.status(403).json({
        error: 'As credenciais são geridas pelas variáveis de ambiente do servidor.',
      });
    }
    const { currentPassword, newUsername, newPassword } = req.body ?? {};
    if (
      typeof currentPassword !== 'string' ||
      typeof newUsername !== 'string' ||
      typeof newPassword !== 'string'
    ) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    const stored = readStoredAuth();
    if (!stored.username || !stored.salt || !stored.passwordHash) {
      return res.status(400).json({ error: 'Credenciais administrativas ainda não definidas.' });
    }

    if (!verifyPasswordHash(currentPassword, stored.salt, stored.passwordHash)) {
      loginLimiter.recordFailure(clientIp);
      return res.status(401).json({ error: 'A palavra-passe actual está incorreta.' });
    }

    const cleanUser = newUsername.trim();
    if (cleanUser.length < 3 || cleanUser.length > 64 || /\s/.test(cleanUser)) {
      return res.status(400).json({
        error: 'O novo utilizador deve ter entre 3 e 64 caracteres sem espaços.',
      });
    }
    if (newPassword.length < 8 || newPassword.length > 128) {
      return res.status(400).json({
        error: 'A nova palavra-passe deve ter entre 8 e 128 caracteres.',
      });
    }

    try {
      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = hashPassword(newPassword, salt);
      writeStoredAuth({
        ...stored,
        username: cleanUser,
        salt,
        passwordHash,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      return res.status(500).json({ error: 'Não foi possível guardar as novas credenciais.' });
    }

    loginLimiter.clear(clientIp);
    return res.status(200).json({
      token: signAdminToken(cleanUser),
      username: cleanUser,
    });
  });

  app.post('/api/upload', (req, res) => {
    try {
      const clientIp = getClientIp(req);
      const isAuthenticatedAdmin = Boolean(getVerifiedAdminFromRequest(req));
      if (!uploadLimiter.check(clientIp, isAuthenticatedAdmin ? 40 : 10)) {
        return res.status(429).json({
          error: 'Limite de envio de ficheiros atingido. Aguarde alguns minutos.',
        });
      }

      const { fileName, mimeType, base64Data, honeypot } = req.body ?? {};
      if (honeypot) {
        return res.status(400).json({ error: 'Submissão rejeitada.' });
      }
      if (
        typeof fileName !== 'string' ||
        typeof mimeType !== 'string' ||
        typeof base64Data !== 'string'
      ) {
        return res.status(400).json({ error: 'Dados de ficheiro inválidos.' });
      }
      const allowedExtsForMime = MIME_TO_EXTENSIONS[mimeType];
      if (!allowedExtsForMime) {
        return res.status(400).json({
          error: 'Formato não suportado. Utilize PDF, DOC, DOCX, PNG, JPG ou WEBP.',
        });
      }

      const ext = path.extname(fileName).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext) || !allowedExtsForMime.includes(ext)) {
        return res
          .status(400)
          .json({ error: 'Extensão de ficheiro incompatível com o formato declarado.' });
      }

      const cleanBase64 = (base64Data.includes(',') ? base64Data.split(',')[1] : base64Data).replace(
        /\s+/g,
        ''
      );
      if (
        !cleanBase64 ||
        cleanBase64.length > 7_000_000 ||
        !/^[A-Za-z0-9+/=]+$/.test(cleanBase64)
      ) {
        return res.status(400).json({ error: 'Conteúdo de ficheiro inválido ou acima de 5 MB.' });
      }

      const buffer = Buffer.from(cleanBase64, 'base64');
      if (buffer.length === 0 || buffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({ error: 'O ficheiro deve ter no máximo 5 MB.' });
      }

      if (!hasValidMagicBytes(buffer, ext)) {
        return res.status(400).json({
          error: 'O conteúdo binário do ficheiro não corresponde ao formato permitido.',
        });
      }

      const safeName = sanitizeFilename(fileName);
      const targetPath = path.resolve(UPLOADS_DIR, safeName);
      if (!targetPath.startsWith(UPLOADS_DIR + path.sep)) {
        return res.status(403).json({ error: 'Caminho de ficheiro inválido.' });
      }

      fs.writeFileSync(targetPath, buffer);
      const sizeKb = Math.max(1, Math.round(buffer.length / 1024));
      const sizeLabel = sizeKb >= 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

      return res.status(201).json({
        url: `/uploads/${safeName}`,
        fileName: path.basename(fileName).slice(0, 180),
        mimeType,
        sizeLabel,
      });
    } catch (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Erro interno ao guardar o documento.' });
    }
  });

  const ALLOWED_NOTIFY_TYPES = new Set(['proposal', 'contact', 'newsletter']);
  app.post('/api/notify', (req, res) => {
    const clientIp = getClientIp(req);
    if (!notifyLimiter.check(clientIp)) {
      return res.status(429).json({ error: 'Demasiados pedidos. Tente novamente mais tarde.' });
    }

    const { type, summary, honeypot } = req.body ?? {};
    if (honeypot) {
      return res.status(400).json({ error: 'Submissão inválida.' });
    }
    if (
      typeof type !== 'string' ||
      !ALLOWED_NOTIFY_TYPES.has(type) ||
      typeof summary !== 'object' ||
      summary === null ||
      Array.isArray(summary)
    ) {
      return res.status(400).json({ error: 'Pedido inválido.' });
    }

    const recipient = process.env.SMTP_TO || 'biosfera.geral@biosfera.ao';
    const smtpConfigured = Boolean(
      process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
    );

    return res.status(200).json({
      dispatched: true,
      recipient,
      deliveryMode: smtpConfigured ? 'smtp-queued' : 'firestore-persisted',
    });
  });

  // Real-time National Environmental & Waste News Proxy (ANR & MINAMB Angola)
  let liveNewsCache = null;
  const LIVE_NEWS_CACHE_TTL_MS = 3 * 60 * 1000;
  let lastForcedRefreshAt = 0;

  function parsePortalNewsHtml(html, source, sourceLabel, portalBase) {
    const items = [];
    const seenUrls = new Set();
    const cardRegex = /<a[^>]*href="([^"]*\/web\/noticias\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;

    while ((match = cardRegex.exec(html)) !== null && items.length < 12) {
      const rawUrl = match[1]?.trim() || '';
      const cardHtml = match[2] || '';
      if (!cardHtml.includes('img-news') && !cardHtml.includes('titlee')) continue;

      const resolvedUrl = rawUrl.startsWith('http')
        ? rawUrl
        : `${portalBase}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
      const fullUrl = sanitizeExternalHttpsUrl(resolvedUrl);
      if (!fullUrl || seenUrls.has(fullUrl)) continue;
      seenUrls.add(fullUrl);

      const imgMatch = cardHtml.match(/<img[^>]+src="([^"]+)"/i);
      const rawImg = imgMatch?.[1]?.trim() || '';
      const resolvedImg = rawImg
        ? rawImg.startsWith('http')
          ? rawImg
          : `${portalBase}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`
        : '';
      const imageUrl = sanitizeExternalHttpsUrl(resolvedImg);

      const dateMatch = cardHtml.match(/<b>\s*(\d{2}-\d{2}-\d{4})\s*<\/b>/i);
      const publishedDate = dateMatch?.[1] || '';

      const titleMatch = cardHtml.match(/<p[^>]*titlee[^>]*>([\s\S]*?)<\/p>/i);
      const title = titleMatch ? decodeHtmlEntities(titleMatch[1]) : '';
      if (!title || title.length < 6) continue;

      const summaryMatch = cardHtml.match(/<p[^>]*font-size:\s*0\.875rem[^>]*>([\s\S]*?)<\/p>/i);
      const summary = summaryMatch ? decodeHtmlEntities(summaryMatch[1]) : '';

      const slugId = fullUrl.split('/').filter(Boolean).pop() || `${source}-${items.length}`;
      items.push({
        id: `${source.toLowerCase()}-${slugId}`,
        title,
        summary,
        url: fullUrl,
        imageUrl,
        publishedDate,
        sortKey: dateToSortKey(publishedDate),
        source,
        sourceLabel,
        sourceUrl: `${portalBase}/web/noticias`,
      });
    }

    return items;
  }

  async function fetchPortalPage(url, source, sourceLabel, portalBase) {
    try {
      const response = await safeFetchHttps(url, {
        allowedHosts: OFFICIAL_PORTAL_HOSTS,
        timeoutMs: 7500,
        accept: 'text/html,application/xhtml+xml',
      });
      if (!response || !response.ok) return { items: [], ok: false };
      const html = await response.text();
      const parsed = parsePortalNewsHtml(html, source, sourceLabel, portalBase);
      return { items: parsed, ok: parsed.length > 0 };
    } catch {
      return { items: [], ok: false };
    }
  }

  async function fetchPortalNewsPaginated(baseNewsUrl, source, sourceLabel, portalBase) {
    const [page1, page2] = await Promise.all([
      fetchPortalPage(baseNewsUrl, source, sourceLabel, portalBase),
      fetchPortalPage(`${baseNewsUrl}?page=2`, source, sourceLabel, portalBase),
    ]);
    const seen = new Set();
    const merged = [];
    for (const item of [...page1.items, ...page2.items]) {
      if (seen.has(item.url)) continue;
      seen.add(item.url);
      merged.push(item);
    }
    return {
      items: merged.slice(0, 8),
      ok: page1.ok || page2.ok,
    };
  }

  function parseRssFeedXml(xml) {
    const items = [];
    const itemRegex = /<(?:item|entry)\b[^>]*>([\s\S]*?)<\/(?:item|entry)>/gi;
    let match;

    const extractTag = (block, tag) => {
      const m = block.match(
        new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i')
      );
      return m?.[1]?.trim() || '';
    };

    while ((match = itemRegex.exec(xml)) !== null && items.length < 8) {
      const block = match[1] || '';
      const title = decodeHtmlEntities(extractTag(block, 'title'));
      const linkMatch = block.match(/<link[^>]*href="([^"]+)"/i);
      const rawLink = decodeHtmlEntities(extractTag(block, 'link')) || linkMatch?.[1] || '';
      const link = sanitizeExternalHttpsUrl(rawLink);
      if (!title || !link) continue;

      const rawDesc =
        extractTag(block, 'description') ||
        extractTag(block, 'summary') ||
        extractTag(block, 'content');
      const summary = decodeHtmlEntities(rawDesc).slice(0, 220);
      const rawDate =
        extractTag(block, 'pubDate') ||
        extractTag(block, 'published') ||
        extractTag(block, 'updated');
      let publishedDate = '';
      let sortKey = 0;
      if (rawDate) {
        const parsedDate = new Date(rawDate);
        if (!Number.isNaN(parsedDate.getTime())) {
          const dd = String(parsedDate.getUTCDate()).padStart(2, '0');
          const mm = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');
          const yyyy = parsedDate.getUTCFullYear();
          publishedDate = `${dd}-${mm}-${yyyy}`;
          sortKey = Number(`${yyyy}${mm}${dd}`);
        }
      }

      const enclosureMatch = block.match(/<(?:enclosure|media:content)[^>]+url="([^"]+)"/i);
      items.push({
        id: `minamb-rss-${items.length}-${sortKey}`,
        title,
        summary,
        url: link,
        imageUrl: sanitizeExternalHttpsUrl(enclosureMatch?.[1] || ''),
        publishedDate,
        sortKey,
        source: 'MINAMB',
        sourceLabel: 'MINAMB — Ministério do Ambiente (RSS)',
        sourceUrl: 'https://minamb.gov.ao/web/noticias',
      });
    }
    return items;
  }

  async function getLiveNewsPayload(forceRefresh) {
    const now = Date.now();
    const allowForce = forceRefresh && now - lastForcedRefreshAt >= 30_000;
    if (!allowForce && liveNewsCache && now < liveNewsCache.expiresAt) {
      return {
        items: liveNewsCache.items,
        fetchedAt: liveNewsCache.fetchedAt,
        sources: liveNewsCache.sources,
        cached: true,
      };
    }
    if (allowForce) {
      lastForcedRefreshAt = now;
    }

    const customRssUrl = sanitizeExternalHttpsUrl(
      process.env.ENVIRONMENTAL_RSS_FEED_URL?.trim() || ''
    );
    const rssPromise = customRssUrl
      ? safeFetchHttps(customRssUrl, {
          timeoutMs: 6500,
          accept: 'application/rss+xml,application/atom+xml,application/xml,text/xml',
        })
          .then((r) => (r && r.ok ? r.text() : ''))
          .then((xml) => (xml ? parseRssFeedXml(xml) : []))
          .catch(() => [])
      : Promise.resolve([]);

    const [anrResult, minambResult, rssExtraItems] = await Promise.all([
      fetchPortalNewsPaginated(
        'https://anr.gov.ao/web/noticias',
        'ANR',
        'ANR — Agência Nacional de Resíduos',
        'https://anr.gov.ao'
      ),
      fetchPortalNewsPaginated(
        'https://minamb.gov.ao/web/noticias',
        'MINAMB',
        'MINAMB — Ministério do Ambiente',
        'https://minamb.gov.ao'
      ),
      rssPromise,
    ]);

    const seenUrls = new Set();
    const combined = [];
    for (const item of [...minambResult.items, ...anrResult.items, ...rssExtraItems]) {
      if (seenUrls.has(item.url)) continue;
      seenUrls.add(item.url);
      combined.push(item);
    }
    combined.sort((a, b) => b.sortKey - a.sortKey);

    const sources = [
      {
        id: 'MINAMB',
        label: 'MINAMB — Ministério do Ambiente',
        url: 'https://minamb.gov.ao/web/noticias',
        ok: minambResult.ok || rssExtraItems.length > 0,
        count: minambResult.items.length + rssExtraItems.length,
      },
      {
        id: 'ANR',
        label: 'ANR — Agência Nacional de Resíduos',
        url: 'https://anr.gov.ao/web/noticias',
        ok: anrResult.ok,
        count: anrResult.items.length,
      },
    ];

    if (combined.length === 0 && liveNewsCache) {
      return {
        items: liveNewsCache.items,
        fetchedAt: liveNewsCache.fetchedAt,
        sources,
        cached: true,
      };
    }

    const fetchedAt = new Date().toISOString();
    liveNewsCache = {
      items: combined,
      fetchedAt,
      expiresAt: Date.now() + LIVE_NEWS_CACHE_TTL_MS,
      sources,
    };

    return {
      items: combined,
      fetchedAt,
      sources,
      cached: false,
    };
  }

  app.get('/api/live-news', async (req, res) => {
    try {
      const forceRefresh = req.query.refresh === '1';
      const payload = await getLiveNewsPayload(forceRefresh);
      res.setHeader(
        'Cache-Control',
        forceRefresh ? 'no-cache' : 'public, max-age=180, stale-while-revalidate=300'
      );
      return res.status(200).json(payload);
    } catch (err) {
      console.error('Live news error:', err);
      return res.status(502).json({ error: 'Não foi possível obter as notícias em tempo real.' });
    }
  });

  app.get('/api/live-news/rss', async (req, res) => {
    try {
      const payload = await getLiveNewsPayload(req.query.refresh === '1');
      const xmlItems = payload.items
        .map(
          (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.url)}</guid>
      <category>${escapeXml(item.sourceLabel)}</category>
      <pubDate>${escapeXml(ddmmyyyyToRfc822(item.publishedDate))}</pubDate>
      <description>${escapeXml(item.summary || item.title)}</description>${
            item.imageUrl
              ? `\n      <enclosure url="${escapeXml(item.imageUrl)}" type="image/jpeg" />`
              : ''
          }
    </item>`
        )
        .join('\n');

      const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>BIOSFERA Angola — Notícias Ambientais Nacionais (MINAMB &amp; ANR)</title>
    <link>https://minamb.gov.ao/web/noticias</link>
    <description>Agregação em tempo real das notícias oficiais do Ministério do Ambiente de Angola (MINAMB) e da Agência Nacional de Resíduos (ANR).</description>
    <language>pt-ao</language>
    <lastBuildDate>${escapeXml(new Date(payload.fetchedAt).toUTCString())}</lastBuildDate>
${xmlItems}
  </channel>
</rss>`;

      res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=180');
      return res.status(200).send(rssXml);
    } catch (err) {
      console.error('Live news RSS error:', err);
      return res.status(502).type('text/plain').send('RSS feed indisponível no momento.');
    }
  });

  const MAX_ARTICLE_CACHE_ENTRIES = 100;
  const liveArticleCache = new Map();

  app.get('/api/live-news/article', async (req, res) => {
    const clientIp = getClientIp(req);
    if (!articleProxyLimiter.check(clientIp)) {
      return res.status(429).json({ error: 'Demasiados pedidos de leitura. Aguarde instantes.' });
    }

    const rawUrl = typeof req.query.url === 'string' ? req.query.url.trim() : '';
    let parsedUrl;
    try {
      parsedUrl = new URL(rawUrl);
    } catch {
      return res.status(400).json({ error: 'URL inválida.' });
    }

    if (
      parsedUrl.protocol !== 'https:' ||
      parsedUrl.username ||
      parsedUrl.password ||
      parsedUrl.port ||
      !OFFICIAL_PORTAL_HOSTS.has(parsedUrl.hostname.toLowerCase()) ||
      !parsedUrl.pathname.startsWith('/web/noticias/')
    ) {
      return res.status(400).json({ error: 'Fonte não autorizada.' });
    }

    const canonicalUrl = parsedUrl.toString();
    const cachedEntry = liveArticleCache.get(canonicalUrl);
    if (cachedEntry && Date.now() < cachedEntry.expiresAt) {
      return res.status(200).json(cachedEntry.article);
    }

    try {
      const response = await safeFetchHttps(canonicalUrl, {
        allowedHosts: OFFICIAL_PORTAL_HOSTS,
        requiredPathPrefix: '/web/noticias/',
        timeoutMs: 7500,
        accept: 'text/html,application/xhtml+xml',
      });
      if (!response || !response.ok) {
        return res.status(502).json({ error: 'Portal oficial indisponível no momento.' });
      }

      const html = await response.text();
      const h1Match = html.match(/<h1[^>]*class="[^"]*section-heading[^"]*"[^>]*>([\s\S]*?)<\/h1>/i);
      const ogTitleMatch = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i);
      const title = decodeHtmlEntities(h1Match?.[1] || ogTitleMatch?.[1] || 'Notícia Oficial');

      const ogImgMatch = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);
      const carouselImgMatch = html.match(/class="carousel-inner"[\s\S]*?<img[^>]+src="([^"]+)"/i);
      const rawImageUrl = carouselImgMatch?.[1] || ogImgMatch?.[1] || '';
      const resolvedImageUrl = rawImageUrl
        ? rawImageUrl.startsWith('http')
          ? rawImageUrl
          : `${parsedUrl.origin}${rawImageUrl.startsWith('/') ? '' : '/'}${rawImageUrl}`
        : '';
      const imageUrl = sanitizeExternalHttpsUrl(resolvedImageUrl);

      const pubTimeMatch = html.match(/property="article:published_time"\s+content="([^"]+)"/i);
      let publishedDate = '';
      if (pubTimeMatch?.[1]) {
        const dt = new Date(pubTimeMatch[1]);
        if (!Number.isNaN(dt.getTime())) {
          publishedDate = `${String(dt.getUTCDate()).padStart(2, '0')}-${String(
            dt.getUTCMonth() + 1
          ).padStart(2, '0')}-${dt.getUTCFullYear()}`;
        }
      }

      const descMatch = html.match(/<div\s+class="description"[^>]*>([\s\S]*?)<\/div>/i);
      const rawBodyHtml = descMatch?.[1] || '';
      const withBreaks = rawBodyHtml
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n');
      const paragraphs = withBreaks
        .split(/\n{2,}/)
        .map((chunk) => decodeHtmlEntities(chunk))
        .filter((p) => p.length > 0);

      const source = parsedUrl.hostname.includes('anr.gov.ao') ? 'ANR' : 'MINAMB';
      const article = {
        title,
        publishedDate,
        imageUrl,
        paragraphs,
        url: canonicalUrl,
        source,
      };

      if (liveArticleCache.size >= MAX_ARTICLE_CACHE_ENTRIES) {
        const oldestKey = liveArticleCache.keys().next().value;
        if (oldestKey) liveArticleCache.delete(oldestKey);
      }
      liveArticleCache.set(canonicalUrl, {
        expiresAt: Date.now() + 10 * 60 * 1000,
        article,
      });

      return res.status(200).json(article);
    } catch {
      return res.status(502).json({ error: 'Não foi possível carregar o artigo oficial.' });
    }
  });

  app.get('/api/health', (_req, res) => {
    res.status(200).json({ ok: true, service: 'biosfera', uptime: Math.round(process.uptime()) });
  });

  app.all('/api/*', (_req, res) => {
    res.status(404).json({ error: 'Rota API não encontrada.' });
  });

  app.use(
    '/uploads',
    express.static(UPLOADS_DIR, {
      dotfiles: 'deny',
      index: false,
      setHeaders: (res, filePath) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
        const ext = path.extname(filePath).toLowerCase();
        if (!IMAGE_EXTENSIONS.has(ext)) {
          res.setHeader('Content-Disposition', 'attachment');
        }
      },
    })
  );
  app.use(
    '/videos',
    express.static(path.resolve(rootDir, 'public', 'videos'), {
      dotfiles: 'deny',
      etag: true,
      lastModified: true,
      maxAge: '30d',
      setHeaders: (res) => {
        res.setHeader('Cache-Control', 'public, max-age=2592000, stale-while-revalidate=86400');
      },
    })
  );
  app.use(
    '/assets',
    express.static(path.resolve(rootDir, 'public', 'assets'), {
      dotfiles: 'deny',
      etag: true,
      lastModified: true,
      maxAge: '30d',
      setHeaders: (res) => {
        res.setHeader('Cache-Control', 'public, max-age=2592000, stale-while-revalidate=86400');
      },
    })
  );
}

function registerStaticFrontendAndErrors(app, rootDir) {
  const candidateDistDirs = [
    path.resolve(rootDir, 'dist'),
    path.resolve(process.cwd(), 'dist'),
  ];
  const distDir =
    candidateDistDirs.find((dir) => fs.existsSync(path.join(dir, 'index.html'))) ||
    candidateDistDirs[0];
  const distIndex = path.join(distDir, 'index.html');

  // Cache dist/index.html in RAM (auto-refreshes if mtime changes) to minimize disk I/O under load
  let cachedIndexHtml = null;
  function getCachedIndexHtml() {
    try {
      const stat = fs.statSync(distIndex);
      if (cachedIndexHtml && cachedIndexHtml.mtimeMs === stat.mtimeMs) {
        return cachedIndexHtml;
      }
      const buffer = fs.readFileSync(distIndex);
      const etag = `"${crypto.createHash('sha1').update(buffer).digest('hex').slice(0, 16)}"`;
      cachedIndexHtml = { buffer, etag, mtimeMs: stat.mtimeMs };
      return cachedIndexHtml;
    } catch {
      return null;
    }
  }

  app.use(
    express.static(distDir, {
      dotfiles: 'deny',
      index: false,
      etag: true,
      lastModified: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        } else if (
          filePath.includes(`${path.sep}assets${path.sep}`) &&
          /\.(js|mjs|css|woff2|woff)$/i.test(filePath)
        ) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (/\.(ico|png|jpe?g|webp|avif|gif|svg|mp4|webm)$/i.test(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=2592000, stale-while-revalidate=86400');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=604800');
        }
      },
    })
  );

  app.get('*', (req, res) => {
    const indexEntry = getCachedIndexHtml();
    if (!indexEntry) {
      res
        .status(503)
        .type('html')
        .send(
          '<!doctype html><html lang="pt-AO"><meta charset="utf-8"><title>BIOSFERA</title><body style="font-family:sans-serif;padding:40px;text-align:center;color:#182C61"><h1>BIOSFERA – Consultoria Ambiental</h1><p>Aplicação em compilação. Execute <code>npm run build</code> e reinicie o servidor.</p></body></html>'
        );
      return;
    }
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader('ETag', indexEntry.etag);
    if (req.headers['if-none-match'] === indexEntry.etag) {
      res.status(304).end();
      return;
    }
    res.type('text/html; charset=utf-8').status(200).send(indexEntry.buffer);
  });

  app.use((err, _req, res, _next) => {
    if (err instanceof SyntaxError && 'body' in err) {
      return res.status(400).json({ error: 'Formato JSON inválido.' });
    }
    console.error('Erro não tratado no servidor:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  });
}

module.exports = {
  registerBiosferaApp,
  registerStaticFrontendAndErrors,
};
