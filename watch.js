#!/usr/bin/env node
/**
 * Dev watcher (replaces `grunt watch`).
 *
 * Rebuilds on change:
 *   - js:    static/src/scripts/*.js      -> static/dist/scripts/
 *   - less:  static/src/styles/*.less     -> static/dist/styles/
 *
 * Process a template or page request afterwards and the fresh assets are
 * picked up (they are served straight from static/dist).
 */
'use strict';

const { spawn } = require('child_process');
const path = require('path');

function run() {
  const child = spawn(process.execPath, [path.join(__dirname, 'build.js')], { stdio: 'inherit' });
  child.on('exit', (code) => { if (code !== 0) console.error('[watch] build failed, waiting for changes...'); });
  return child;
}

console.log('[watch] initial build...');
run();

let timer = null;
function scheduleRebuild(label) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    console.log(`[watch] ${label} changed, rebuilding...`);
    run();
  }, 100);
}

const { watch } = require('fs');
watch(path.join(__dirname, 'static', 'src', 'scripts'), { recursive: true }, (e, f) => {
  if (f && f.endsWith('.js')) scheduleRebuild('scripts/' + f);
});
watch(path.join(__dirname, 'static', 'src', 'styles'), { recursive: true }, (e, f) => {
  if (f && f.endsWith('.less')) scheduleRebuild('styles/' + f);
});

console.log('[watch] watching static/src/{scripts,styles} — Ctrl+C to stop');
