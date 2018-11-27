# SOFA interactions with LDP

Mainly via: matchservice-utils.js

Also note: actionsRdf.js, load-fragments.js

These files contain all references to axios, the HTTP client library used.

All HTTP access is performed via Axios.

## matchservice-utils.js


@@@@


## actionsRdf.js

`getTurtle(uri)` - load and parse RDF from Turtle source at URL.

Intent is that this will disappear, using code in matchservice-utils.js

Q: how do exceptions interact with Promises?  E.g. if Turtle has syntax error.

A: promise catches exception, turns into failure resolution - promise invokes error callback.  If failure not provided, `then` method cascades error to subsequent promises until caught (like Error monad).


## load-fragments.js



## React / Redux  usage

E.g. see `loadConfig` in `load-fragments`; alse call in app.js

Call provides a "dispatch" function that is called asynchronously when the (e.g. config) data had been read.  Typically, this is provided by the Redux framework via the JSX code for the page data being generated.

Except, for loadConfig, "props" is an attribute of the App component object.


