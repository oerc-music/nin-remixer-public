#!/bin/bash

BASEURI="http://localhost:8080/"

# Create a container for the workset
curl -i -X POST -H "Content-Type: text/turtle" -H "Slug: workset1" -H 'Link: <http://www.w3.org/ns/ldp#BasicContainer>; rel="type"' $BASEURI --data "@working-set-container.ttl"

# We assume that the slug was used
CONTAINERURI=${BASEURI}workset1/

# Load fragments
for i in echo 1 2 3 ; do
   curl -i -X POST -H "Content-Type: text/turtle" -H "Slug: frag$i" -H 'Link: <http://www.w3.org/ns/ldp#Resource>; rel="type"' --data "@working-set-frag$i.ttl" $CONTAINERURI
done

