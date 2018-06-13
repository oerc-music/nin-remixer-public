#!/bin/bash

BASEURI="http://localhost:8080/"
SLUG="workset"

# Create a container for the workset
OUT=`curl -i -X POST -H "Content-Type: text/turtle" -H "Slug: ${SLUG}" -H 'Link: <http://www.w3.org/ns/ldp#BasicContainer>; rel="type"' $BASEURI --data "@container-template.ttl"`

#echo "$OUT"

CONTAINERURI=`echo "$OUT" | tr -d '\r' | grep '^Location: \W*' | cut -d" " -f2`

echo ${CONTAINERURI}

# Load fragments
cat <<EOL |
http://beta.numbersintonotes.net/meld/ea115105-3bad-405c-b19f-14b3baa46fa0
http://beta.numbersintonotes.net/meld/c3249eb5-7728-4aef-88da-14abff2c2b26
http://beta.numbersintonotes.net/meld/319a29fc-ad57-4a43-8773-d26e6e3993d3
http://beta.numbersintonotes.net/meld/52aea698-df27-4a6f-8102-ae9b2680805d
http://beta.numbersintonotes.net/meld/dce574db-44bf-4654-b057-2ef132819735
http://beta.numbersintonotes.net/meld/3068154d-fd6e-48dc-a7d4-bf18d5a214ce
http://beta.numbersintonotes.net/meld/5c105e75-2535-4ea4-96f0-f97ae3fdfcc7
EOL
while read FRAG
do
  echo $FRAG
  ./nin-import "$CONTAINERURI" "$FRAG"
done

echo Container created at:
echo $CONTAINERURI
