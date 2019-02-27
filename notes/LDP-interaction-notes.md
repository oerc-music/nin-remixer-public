# SOFA interactions with LDP

@@TODO:

- diagram of Working set structure (note the 2-level indirection? LDP -> fragment-link ->fragment-description).  See also Example-WorkingSet-LinkedFragments.ttl.


Mainly via: matchservice-utils.js

Also note: actionsRdf.js, load-fragments.js

These files contain all references to axios, the HTTP client library used.

All HTTP access is performed via Axios.

## match-service/matchservice-utils.js

Generally: get--- returns list, find--- returns single matching entity.

`createWSIcontainer(baseuri, slug)`

`createContainer(baseuri, type, slug)` - `type` is additional conter type as well as `ldp:BasicContainer`.

`getLDPcontents(uri)` - @@NOTE: very similar to function of same name in `src/actionsRdf.js`

`addAnnotation(conturi, targeturi, bodyuri, motivation)`

`getAnnotation(annuri, targeturi = null, bodyuri = null)` - `bodyuri` filters on a specific body URI - how is this used?  Pattern useful some filtering operations (e.g., finding instrument annotations for a given fragment): returns `bodyuri` or null.

`findAnnotation(conturi, targeturi)` - Find first annotation targeting a given URI.  (Can be slow.)

`findExistingAnn(cont, target, body)` - like `findAnnotation` but also filtering on body URI.

`findAnnotationR(conturi, targeturi)` - recursive search indirect references.  Effectively subsumes `findAnnotation`.

`findMatchService(wsi, matchtype, workset)` - compositioon of `findAnnotation` calls on different containers in the SOFA match service structure.

`getAnnotations(conturi)` - emnumerates annotations in a container, searcvhing recursively in indirectly referenced containers.

`findAnnotationMatches(conturi, targeturi)` - like `findAnnotationR` but returns all matches.

`findOrCreateContainer(
    outerContUri, targetUri, baseuri, typeuri, slug, motivation = MOTIVATION_ID
    )` - used in scripts that create new service data, where containers are not (in general) created ahead of time.  Used when creating annotations whose body is another container.  Typically, the result will be used as a container fior a subsequent `addAnnotation`.

`getMatchServices(wsi, workset)` - search SOFA structures and returns list of service [containers] for a given workset.

`getAvailInstruments(wsi, workset)` - searches SOFA structures to returnlist of available instruments coivered by available match services.


## src/actionsRdf.js

`getTurtle(uri)` - load and parse RDF from Turtle source at URL.

Intent is that this will disappear, using code in matchservice-utils.js

Q: how do exceptions interact with Promises?  E.g. if Turtle has syntax error.

A: promise catches exception, turns into failure resolution - promise invokes error callback.  If failure not provided, `then` method cascades error to subsequent promises until caught (like Error monad).

`getFragInfo(uri)` - retrieves fragment link `uri` that points to fragment descriptor, which is retrieved in turn, and values extracted and returned as object:

   {id: ...,
    fragref: ...,
    title: ...,
    key: ...,
    mode: ...,
    mei: ... }


`getLDPcontents(uri)` - return LDP content URIs as promise.  Expects container of fragment links, which in turn point to fragment descriptions, which in turn have metadata and point to MEI.


## src/components/load-fragments.js

`mkFragmentsPromise(workset)` - for each fragment in a workset, load and save fragment details and SVG-rendered version of the referenced MEI.  (Happens asynchronously at load time.)


## React / Redux / Redux-thunk  usage

E.g. see `loadConfig` in `load-fragments`; also call in app.js

Call provides a "dispatch" function that is called asynchronously when the (e.g. config) data has been read.  Typically, this is provided by the Redux framework via the JSX code for the page data being generated.

Except, for loadConfig, "props" is an attribute of the App component object.

        axios.get('/config.json')
          .then(response => {
                dispatch({type:'SETCONFIG', config: response.data})
          })

This is a direct Redux state update on completion of the async get operation.  (See also: reducer.js)

E.g. see dispatch(mkFragmentsPromise(workset)) in "LoadButton" in load-fragments.js.  In this case, mkFragmentsPromise returns a function that is subsequently intercepted and called by redux-thunk (as opposed to a simple message that is used to directly update the redux store)




