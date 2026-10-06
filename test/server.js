#!/usr/bin/env node
/**
 * Test server (replaces grunt-mocha + PhantomJS).
 *
 * Serves the mocha/chai browser test harness from test/ so the specs can be
 * run in a real browser:
 *
 *   node test/setup-vendor.js   once, copies mocha/chai browser bundles
 *   npm test                    starts this server
 *   open http://localhost:9001/index.html
 */
'use strict';

const connect = require('connect');
const serveStatic = require('serve-static');
const http = require('http');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = process.env.TEST_PORT || 9001;

const app = connect();

// mocha / chai browser bundles, copied into test/vendor by test/setup-vendor.js
app.use('/vendor/mocha', serveStatic(path.join(ROOT, 'node_modules', 'mocha')));
app.use('/vendor', serveStatic(path.join(__dirname, 'vendor')));
// spec/, gantt-src.js bundle, index.html
app.use(serveStatic(__dirname));

const server = http.createServer(app).listen(PORT, 'localhost', () => {
  console.log(`Test server running: http://localhost:${PORT}/index.html`);
  console.log('Open it in a browser to see the mocha results (Ctrl+C to stop).');
});

process.on('SIGINT', () => process.exit(0));
