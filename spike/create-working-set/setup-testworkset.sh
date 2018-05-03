#!/bin/bash

BASEURI="http://localhost:8080/"
SLUG="newworkset"

# Create a container for the workset
curl -i -X POST -H "Content-Type: text/turtle" -H "Slug: ${SLUG}" -H 'Link: <http://www.w3.org/ns/ldp#BasicContainer>; rel="type"' $BASEURI --data "@test-set-container.ttl"

# We assume that the slug was used
CONTAINERURI=${BASEURI}${SLUG}/

# Load fragments
cat <<EOL |
http://beta.numbersintonotes.net/meld/1cfc852a-2fd9-4f9d-b022-f8aaa65853b7.ttl
http://beta.numbersintonotes.net/meld/ce4bef91-131c-4a12-ae67-e7d33b4ca463.ttl
http://beta.numbersintonotes.net/meld/a63c7d61-3a71-4f8a-83f1-82eb597e212d.ttl
http://beta.numbersintonotes.net/meld/2d583ae4-fbce-49ef-81a9-d4e5d5726b88.ttl
http://beta.numbersintonotes.net/meld/f06c4000-3557-42b4-88fc-0b7b19bfe151.ttl
EOL
while read FRAG
do
  echo $FRAG
  ./nin-import "$CONTAINERURI" "$FRAG"
done

