#!/bin/bash

SLUG="workset"

BASEURI="http://localhost:8080/"
FRAGFILE="fragments"

AUTHOR="The SOFA"
CREATED="$(date -Is)"

# Load config file to overide the above if specified
if [ "x$1" != x ]; then
  if echo $1 |grep '/' ; then
    . $1 
  else
    echo Using ./$1
    . ./$1
  fi
fi

# Fill in container template
cat container-template.ttl |sed "s|AUTHOR|$AUTHOR|;s|CREATED|$CREATED|" >container-filled.ttl

echo $BASEURI
echo $FRAGFILE

# Create a container for the workset
OUT=`curl -i -X POST -H "Content-Type: text/turtle" -H "Slug: ${SLUG}" -H 'Link: <http://www.w3.org/ns/ldp#BasicContainer>; rel="type"' $BASEURI --data "@container-filled.ttl"`

#echo "$OUT"

CONTAINERURI=`echo "$OUT" | tr -d '\r' | grep '^Location: \W*' | cut -d" " -f2`

echo ${CONTAINERURI}

#export FRAGFILE
#if [ "x$FRAGFILE" == x ]; then FRAGFILE=fragments ; fi

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
