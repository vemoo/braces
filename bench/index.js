'use strict';

const { Suite } = require('benchmark');
const colors = require('ansi-colors');
const argv = require('minimist')(process.argv.slice(2));
const minimatch = require('minimatch');
const compile = require('../lib/compile');
const expand = require('../lib/expand');
const parse = require('../lib/parse');

/**
 * Setup
 */

const cycle = (e, newline) => {
  process.stdout.write(`\u001b[G  ${e.target}${newline ? `\n` : ''}`);
};

const bench = (name, options) => {
  const config = { name, ...options };
  const suite = new Suite(config);
  const add = suite.add.bind(suite);
  suite.on('error', console.error);

  if (argv.run && !new RegExp(argv.run).test(name)) {
    suite.add = () => suite;
    return suite;
  }

  console.log(colors.green(`● ${config.name}`));

  suite.add = (key, fn, opts) => {
    if (typeof fn !== 'function') opts = fn;

    add(key, {
      onCycle: e => cycle(e),
      onComplete: e => cycle(e, true),
      fn,
      ...opts
    });
    return suite;
  };

  return suite;
};

const skip = () => {};
skip.add = () => skip;
skip.run = () => skip;
bench.skip = name => {
  console.log(colors.cyan('● ' + colors.unstyle(name) + ' (skipped)'));
  return skip;
};

bench('parse set')
  .add('picomatch', () => parse('foo/{a,b,c}/bar'))
  .add('minimatch', () => minimatch.braceExpand('foo/{a,b,c}/bar'))
  .run();

bench('parse nested sets')
  .add('picomatch', () => parse('foo/{a,b,{x,y,z}}/bar'))
  .add('minimatch', () => minimatch.braceExpand('foo/{a,b,{x,y,z}}/bar'))
  .run();

bench('parse range')
  .add('picomatch', () => parse('foo/{a..z}/bar'))
  .add('minimatch', () => minimatch.braceExpand('foo/{a..z}/bar'))
  .run();

bench.skip('expand')
  .add('picomatch', () => expand(parse('foo/{a,b,c}/bar')))
  .add('minimatch', () => minimatch.braceExpand('foo/{a,b,c}/bar'))
  .run();

bench.skip('compile')
  .add('picomatch', () => compile(parse('foo/{a,b,c}/bar')))
  .add('minimatch', () => minimatch.makeRe('foo/{a,b,c}/bar'))
  .run();