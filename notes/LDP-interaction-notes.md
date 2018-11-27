# SOFA interactions with LDP

Mainly via: matchservice-utils.js

Also note: actionsRdf.js, load-fragments.js

These files contain all references to axios(?), the HTTP client library used.

## matchservice-utils.js


## actionsRdf.js

`getTurtle(uri)` - load and parse RDF from Turtle source at URL.

Q: how do exceptions interact with Promises?  E.g. if Turtle has syntax error.

## load-fragments.js


