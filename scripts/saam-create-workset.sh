#!/bin/bash

BASEURI="http://thalassa.oerc.ox.ac.uk:8080/"
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
http://beta.numbersintonotes.net/meld/5c105e75-2535-4ea4-96f0-f97ae3fdfcc7
http://beta.numbersintonotes.net/meld/0deb9a3e-5320-41de-a5ff-db1b3a0edc45
http://beta.numbersintonotes.net/meld/da00230a-45b6-4737-996d-7affc35e06a9
http://beta.numbersintonotes.net/meld/22a45acb-716c-40fb-843d-ab7d6f64d507
http://beta.numbersintonotes.net/meld/3912fb49-38f8-4e02-aa1a-647aac171e3e
http://beta.numbersintonotes.net/meld/f905cd0e-331f-4c53-b1f8-23a379232050
http://beta.numbersintonotes.net/meld/d463ecab-b7ca-4dd9-a991-46bf4b328887
http://beta.numbersintonotes.net/meld/5f24a6bf-05aa-4588-84f9-fc2ea8c8cff3
http://beta.numbersintonotes.net/meld/e663375b-04a3-46d9-8d39-e92bbd5f53d0
http://beta.numbersintonotes.net/meld/d322e5e5-595a-412e-a6db-56a0d75b6cb0
http://beta.numbersintonotes.net/meld/4218e20a-d885-43d4-a71a-9d2775ba39a2
http://beta.numbersintonotes.net/meld/815f055a-9c3e-4318-be29-b2ccc703f072
http://beta.numbersintonotes.net/meld/efb7e8fc-7e2d-4df6-8cdf-f03b04dd0f0d
EOL
while read FRAG
do
  echo $FRAG
  ./nin-import "$CONTAINERURI" "$FRAG"
done

echo Container created at:
echo $CONTAINERURI
