#!/usr/bin/env node

/**
 * Try this command:
 * node commander-test.js foo bar --foo --bar --baz=xxx
 */

/**
 * Module dependencies.
 */

var program = require('commander');

program
  .version('0.1.0')
  .option('-f, --foo', 'Foo')
  .option('-b, --bar', 'Bar')
  .option('-z, --baz [val]', 'baz [def]', 'def')
  .parse(process.argv);

console.log('program %s', program);
if (program.foo) console.log('  --foo');
if (program.bar) console.log('  --bar');
console.log('  --baz %s', program.baz);

program.args.forEach(
    (val, index) => {
        console.log(`${index}: ${val}`);
        }
    );
