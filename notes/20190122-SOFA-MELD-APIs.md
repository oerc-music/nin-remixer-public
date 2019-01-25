# LDP APIs used by SOFA

## Common references

@@TODO: adde details of metadata@@

**root-uri** is the URI of a root container used by SOFA.

**f-uri** is the URI of a musical fragment (typically as MEI)

**fr-uri** is the uri of a fragment reference, whichin turn references an MEI (or other?) representation of a musical fragment.

**ws-uri** is the URI of a container of semantically annotated fragments.

**ac-uri** is the URI of a container of annotations.

## Operations

### Create working set (workset)

See: scripts/create-workset.sh and scripts/container-template.ttl

Working set set container contains:

    <> a ldp:BasicContainer, ldp:Container , ninre:WorkSet ;
       dc:author "$author" ;
       dct:created "$created" .

Where

`$author` is a string (?) with the author name

`$created` is the date on which the workset container is created


### Add fragment to working set

See: scripts/nin-import and scripts/create-workset.sh

Given *`ws-uri`*:

HTTP POST to *ws-uri*, with the following header fieklds:

    Content-Type: text/turtle
    Slug: $SLUG
    Link: <http://www.w3.org/ns/ldp#Resource>; rel="type"

and a request body containing a fragment reference, which looks like this:

    <> a ninre:FragmentRef , ldp:Resource ;
      ninre:fragment <$f-uri> ;
      dc:creator "$user" ;
      dct:created "$date" .

The HTTP response should be "204 CREATED", and incluyde a `Location` headser that indicates the URI of the fragment reference in the working set container.


