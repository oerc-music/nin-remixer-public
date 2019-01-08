# Experiments with command line applications using node.js

## `nodejs_command_line.js`

Tests access to command line parameters.

E.g.:

    $ node nodejs_command_line.js foo bar
    0: /Users/graham/.nvm/versions/node/v10.15.0/bin/node
    1: /Users/graham/workspace/github/oerc-music/nin-remixer-public/spike/nodejs_command_line/nodejs_command_line.js
    2: foo
    3: bar

## `commander-test.js`

Using `commander` command line parsing library.

E.g.:

    $ node commander-test.js foo bar --foo --bar --baz=xxx
    program [object Object]
      --foo
      --bar
      --baz xxx
    0: foo
    1: bar


