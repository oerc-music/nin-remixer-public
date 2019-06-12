#!/bin/bash

export WORKSET=$1

export INSTRUMENTS=selected-instrument-uris

if [ x != x$2 ]; then
    INSTRUMENTS=$2
fi

echo Workset: $WORKSET

echo INSTRUMENTS

for i in `cat $INSTRUMENTS`; do
  node instrumentmatch.js $WORKSET $i
done

