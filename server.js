'use strict';

const express = require('express');
const { registerBiosferaApp, registerStaticFrontendAndErrors } = require('./server-app.js');

const ROOT_DIR = __dirname;
const rawPort = process.env.PORT ? process.env.PORT.trim() : '';
const PORT = rawPort && /^\d+$/.test(rawPort) ? Number(rawPort) : rawPort || 3000;

const app = express();
registerBiosferaApp(app, ROOT_DIR);
registerStaticFrontendAndErrors(app, ROOT_DIR);

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Pure CommonJS + synchronous app.listen(PORT) without IPv4-only host restriction:
// Compatible with Hostinger LiteSpeed lsnode.js (require('./server.js') on Node 20),
// dual-stack IPv4/IPv6 reverse proxies, and Unix sockets.
const server = app.listen(PORT, () => {
  console.log(`BIOSFERA server listening on ${PORT}`);
});

// Prevent premature keep-alive resets behind LiteSpeed/Hostinger reverse proxies
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

server.on('error', (err) => {
  console.error('BIOSFERA server listen error:', err);
});

function gracefulShutdown(signal) {
  console.log(`BIOSFERA server received ${signal}, closing gracefully...`);
  server.close(() => {
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 4000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;
