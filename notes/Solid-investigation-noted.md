# Solid investigation notes

## Solid pod server as LDP backend

- https://github.com/solid/node-solid-server
- https://github.com/solid/solid-spec
- https://github.com/solid/webid-oidc-spec

Node based, but also available as Docker container.

Has an option to run without authentication (vanilla LDP), which could presumably be fronted by a web server (e.g. Apache or NginX) access control.

## Authentication options:

1. WebID - depends on browser genkey support?
2. OpenID Connect (OIDC), with extensions, to yield authenticated WebID

WebID URL (e.g. https://gklyne.inrupt.net/profile/card#me) dereferences to an RDF (default Turtle) document like this:

    @prefix solid: <http://www.w3.org/ns/solid/terms#>.
    @prefix foaf: <http://xmlns.com/foaf/0.1/>.
    @prefix pim: <http://www.w3.org/ns/pim/space#>.
    @prefix schema: <http://schema.org/>.
    @prefix ldp: <http://www.w3.org/ns/ldp#>.

    <>
        a foaf:PersonalProfileDocument ;
        foaf:maker <https://gklyne.inrupt.net/profile/card#me> ;
        foaf:primaryTopic <https://gklyne.inrupt.net/profile/card#me> .

    <https://gklyne.inrupt.net/profile/card#me>
        a foaf:Person ;
        a schema:Person ;

        foaf:name "Graham" ;

        solid:account </> ;  # link to the account uri
        pim:storage </> ;    # root storage

        ldp:inbox </inbox/> ;

        pim:preferencesFile </settings/prefs.ttl> ;  # private settings/preferences
        solid:publicTypeIndex </settings/publicTypeIndex.ttl> ;
        solid:privateTypeIndex </settings/privateTypeIndex.ttl> .

It appears that `/profile/` may be a container, and `card` a document within that container.

@@Need to figure out how to login using Curl??

