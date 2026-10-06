#!/usr/bin/env node
/**
 * Front-end build script (replaces the old Gruntfile.js toolchain).
 *
 *   node build.js       build everything (js + css)
 *   node build.js js    bundle only
 *   node build.js css   compile + autoprefix less only
 *
 * Usage from npm scripts:
 *   npm run build | build:js | build:css
 */
'use strict';

const esbuild = require('esbuild');
const less = require('less');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'static', 'src');
const DIST = path.join(__dirname, 'static', 'dist');

async function buildJs() {
  await esbuild.build({
    entryPoints: [path.join(SRC, 'scripts', 'gantt.js')],
    outfile: path.join(DIST, 'scripts', 'gantt.js'),
    bundle: true,
    format: 'iife',
    target: ['es2018'],
    minify: false,
    sourcemap: false,
    logLevel: 'info',
  });
}

async function buildCss(file) {
  const src = path.join(SRC, 'styles', file);
  const dest = path.join(DIST, 'styles', file.replace(/\.less$/, '.css'));
  const result = await less.render(await fs.promises.readFile(src, 'utf8'), {
    filename: src,
    sourceMap: { sourceMapFileInline: false },
  });
  const prefixed = await postcss([autoprefixer({ overrideBrowserslist: ['> 1%', 'last 2 versions', 'Firefox ESR'] })])
    .process(result.css, { from: src, to: dest, map: { inline: false, prev: result.map || false } });
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await fs.promises.writeFile(dest, prefixed.css);
  if (prefixed.map) await fs.promises.writeFile(dest + '.map', prefixed.map.toString());
  console.log(`built ${path.relative(process.cwd(), dest)}`);
}

async function buildCssAll() {
  const files = (await fs.promises.readdir(path.join(SRC, 'styles'))).filter((f) => f.endsWith('.less'));
  for (const f of files) await buildCss(f);
}

async function main() {
  const target = process.argv[2];
  const t0 = Date.now();
  if (target === 'js') await buildJs();
  else if (target === 'css') await buildCssAll();
  else if (!target) {
    await buildJs();
    await buildCssAll();
  } else {
    console.error(`unknown target "${target}" (use js | css | nothing for all)`);
    process.exit(1);
  }
  console.log(`done in ${Date.now() - t0}ms`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
