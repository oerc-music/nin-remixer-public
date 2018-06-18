#!/bin/bash

BASEURI="http://localhost:8080/"
SLUG="workset"

# Create a container for the workset
OUT=`curl -i -X POST -H "Content-Type: text/turtle" -H "Slug: ${SLUG}" -H 'Link: <http://www.w3.org/ns/ldp#BasicContainer>; rel="type"' $BASEURI --data "@container-template.ttl"`

#echo "$OUT"

CONTAINERURI=`echo "$OUT" | tr -d '\r' | grep '^Location: \W*' | cut -d" " -f2`

echo ${CONTAINERURI}

export FRAGFILE
if [ "x$FRAGFILE" == x ]; then FRAGFILE=fragments ; fi

echo Loading fragments from: $FRAGFILE

# Load fragments
cat <$FRAGFILE |
while read FRAG
do
  echo $FRAG
  ./nin-import "$CONTAINERURI" "$FRAG"
done

echo Container created at:
echo $CONTAINERURI
