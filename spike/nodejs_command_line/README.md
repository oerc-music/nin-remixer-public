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



## Other notes

## Getting syntax errors?

TL;DR: Try this:

    . ~/.nvm/nvm.sh
    . ~/.nvm/bash_completion

Longer version:

The above scripts require a more recent version of node than comes by default with MacOS El Capitan.  Use 'nvm' to work with alternative versions of node.

The following commands install `nvm`:

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

To activate `nvm`, use:

    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

To use `nvm` to install a recent version of node,muse some combination of the following:

    nvm
    nvm install latest
    nvm ls-remote
    nvm install v10.15.0
    node -v

<!-- (saved from `history`)
    293  node nodejs_command_line.js foo bar
    294  node -v
    295  which node
    296  nvm
    297  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
    298  export NVM_DIR="$HOME/.nvm"
    299  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    300  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
    301  nvm
    302  ls -al
    303  nvm install latest
    304  nvm ls-remote
    305  nvm install v10.15.0
    306  node -v
    307  ls
    308  node nodejs_command_line.js
    309  node nodejs_command_line.js foo bar
    310  node nodejs_command_line.js foo bar
    311  npn install commander --save
    312  npm install commander --save
    313  npm audit
    314  npm audit fix
    315  npn audit fix --force
    316  npm audit fix --force
    317  npm audit
    318  node nodejs_command_line.js foo bar
    319  which node
    320  node commander-test.js foo bar
-->