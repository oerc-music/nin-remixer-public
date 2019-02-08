# Notes for installing and running Solid server

## Install NVM

ES6 is supported only by a more recent version of node.js than comes by default with MacOS El Capitan.  Use 'nvm' to work with alternative versions of node.js.

The following command installs `nvm` (to `$HOME/.nvm`?):

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

To activate `nvm` in directory `$NVM_HOME`, use:

    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

## Install latest node.js

To use `nvm` to install a recent version of node, use some combination of the following:

    nvm
    nvm ls-remote
    nvm install v10.15.0
    node -v

## Activate latest node.js

This needs to be done for each login.

    . ~/.nvm/nvm.sh
    . ~/.nvm/bash_completion

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

## Install local Solid server

See: https://solid.inrupt.com/docs/installing-running-nss

    npm install -g solid-server

@@QUERY: may be better to not use `-g`, then change to the appropriate directory @@@ to run solid?

Create and change to working directory for server data (e.g. `$HOME/solid`).

Set up certificate (or see https://letsencrypt.org/docs/certificates-for-localhost/). For now, using a self-signed certificate:

    openssl req -x509 -out localhost.crt -keyout localhost.key \
      -newkey rsa:2048 -nodes -sha256 \
      -subj '/CN=localhost' -extensions EXT -config <( \
       printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

Move `localhost.crt` anbd `localhost.key` to a separate directory; e.g. `./certs/`.

Initialize Solid (see https://github.com/solid/node-solid-server#run-a-single-user-server-beginner):

    $ solid init
    ? Path to the folder you want to serve. Default is /Users/graham/solid/data
    ? SSL port to run on. Default is 8443
    ? Solid server uri (with protocol, hostname and port) https://localhost:8443
    ? Enable WebID authentication No
    ? Serve Solid on URL path /
    ? Path to the config directory (for example: /etc/solid-server) ./config
    ? Path to the config file (for example: ./config.json) ./config.json
    ? Path to the server metadata db directory (for users/apps etc) ./.db
    ? Path to the SSL private key in PEM format ./certs/localhost.key
    ? Path to the SSL certificate key in PEM format ./certs/localhost.crt
    ? Enable multi-user mode No
    ? Do you want to set up an email service? No
    ? A name for your server (not required, but will be presented on your server's frontpage) localhost
    ? A description of your server (not required) Test server for MELD tools
    ? A logo that represents you, your brand, or your server (not required)

Start Solid:

    solid start

In the MELD tools directory:

    export NODE_EXTRA_CA_CERTS=$SOLID/certs/localhost.crt
    export NODE_TLS_REJECT_UNAUTHORIZED=0
    node meld_tool.js create-workset https://localhost:8443/ wstest

(The second of these exports shouldn't be necessary?)


How to get set up with an LDP container?
Looks like registering a user does it?
In non-multi-user mode, the base container is at https://localhost:8443/public/

I found I also needed:

    export NODE_PATH=/Users/graham/.nvm/versions/node/v10.15.0/lib/node_modules/

    node meld_tool.js test-login \
        --provider=https://localhost:8443 \
        --username=gklyne --password=****

@@@@ add url to command line?



## WebID authentication


https://github.com/solid/solid/issues/146 (discussion)

https://github.com/njh/gen-webid-cert

https://github.com/linkeddata/node-webid/

https://github.com/jeff-zucker/solid-file-client (non-browser authentication)

https://github.com/jeff-zucker/solid-file-client/blob/master/lib/solid-shell-client.js

https://github.com/solid/solid-cli

https://github.com/solid/solid-cli/blob/master/src/SolidClient.js

https://github.com/solid/solid-cli/blob/master/bin/solid-bearer-token

https://nodejs.org/api/modules.html#modules_all_together

