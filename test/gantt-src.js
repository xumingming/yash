/**
 * Test bundle: expose the app modules to the browser specs.
 *
 * The dist bundle (static/dist/scripts/gantt.js) is built in IIFE format and
 * deliberately does not export internals. For the mocha specs we let esbuild
 * treeshake nothing and attach the modules we care about to `window`.
 */
'use strict';

const utils = require('../static/src/scripts/utils');

window.appModules = { utils: utils };
