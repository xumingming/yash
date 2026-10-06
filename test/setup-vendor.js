#!/usr/bin/env node
/**
 * One-time setup for the browser test harness: copy the mocha and chai
 * browser bundles from npm into test/vendor (replaces bower_components).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const vendor = path.join(__dirname, 'vendor');
fs.mkdirSync(vendor, { recursive: true });

fs.copyFileSync(
  path.join(__dirname, '..', 'node_modules', 'mocha', 'mocha.js'),
  path.join(vendor, 'mocha.js')
);
fs.copyFileSync(
  path.join(__dirname, '..', 'node_modules', 'mocha', 'mocha.css'),
  path.join(vendor, 'mocha.css')
);

// chai's browser bundle: resolve the ESM->UMD browser field (chai 6 ships dist/chai.js)
const chaiPkg = require(path.join(__dirname, '..', 'node_modules', 'chai', 'package.json'));
const chaiPath = path.join(__dirname, '..', 'node_modules', 'chai', path.dirname(chaiPkg.main || 'index.js'), '..', 'chai.js');
const candidates = [
  path.join(__dirname, '..', 'node_modules', 'chai', 'chai.js'),
  chaiPath,
];
let copied = false;
for (const c of candidates) {
  if (fs.existsSync(c)) {
    fs.copyFileSync(c, path.join(vendor, 'chai.js'));
    copied = true;
    break;
  }
}
if (!copied) {
  console.error('could not locate chai browser bundle, looked at:', candidates);
  process.exit(1);
}
console.log('copied mocha.js, mocha.css, chai.js ->', vendor);
