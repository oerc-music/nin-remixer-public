
## Install GOLD

Get dependencies Ubuntu:

    sudo apt-get install golang-go libraptor2-dev libmagic-dev

Mac seems to be (untested): `brew install go raptor libmagic`

Setup paths and check go version:

    mkdir ~/go
    export GOPATH=~/go
    go version

Reported to need version >= 1.4

Install with go get:

    go get github.com/linkeddata/gold/server

## Run server

Make a data dir; copy config to server dir then edit to point to data dir:

    mkdir PATH-TO-DATA-DIR/gold-data/
    cp gold.conf $GOPATH/src/github.com/linkeddata/gold/server/gold.conf
    vi $GOPATH/src/github.com/linkeddata/gold/server/gold.conf

Start the server:

    $GOPATH/bin/server -conf=$GOPATH/src/github.com/linkeddata/gold/server/gold.conf

## Load the data

    ./load-data.sh

Browse it at http://localhost:8080/

