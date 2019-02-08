# Command line tool(s) for accessing MELD/LDP containers

## `meld_tool.js`

@@TODO

Try:

    node meld_tool.js --help


## Other notes

## Getting syntax errors?

TL;DR: Try this:

    . ~/.nvm/nvm.sh
    . ~/.nvm/bash_completion

Longer version:

These scripts require a more recent version of node than comes by default with MacOS El Capitan.  Use 'nvm' to work with alternative versions of node.

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
