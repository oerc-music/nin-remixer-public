var axios = require('axios');
var rdf = require('rdflib');
var url = require('url');

// Prefixes and vocab constants

const prefixes = `
@prefix ldp: <http://www.w3.org/ns/ldp#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix dc: <http://purl.org/dc/elements/> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix nin: <http://numbersintonotes.net/terms#> .
@prefix ninre: <http://remix.numbersintonotes.net/vocab#> .
@prefix oa: <http://www.w3.org/ns/oa#> .
`

const NINRE_WorkSetServiceIndex = 'ninre:WorkSetServiceIndex'
const NINRE_WorkSetService = 'ninre:WorkSetService'
const NINRE_MatchService = 'ninre:MatchService'
const NINRE_keyCompat = 'ninre:keyCompatibility'
const MOTIVATION_ID = 'http://www.w3.org/ns/oa#linking'
const MOTIVATION_RECURSE ='http://remix.numbersintonotes.net/vocab#seeHere'
const INSTRUMENT_SERVICE ='http://remix.numbersintonotes.net/vocab#instrumentCompatibility'

const REMIX = rdf.Namespace("http://remix.numbersintonotes.net/vocab#")
const DC = rdf.Namespace("http://purl.org/dc/elements/")
const NIN = rdf.Namespace("http://numbersintonotes.net/terms#")

function idlog(x) {
        console.log(x)
        return x
}
module.exports.idlog = idlog

function createWSIcontainer(baseuri, slug) {
  //const worksetIndTemplate = prefixes + "<> a ldp:BasicContainer, ninre:WorkSetServiceIndex . "
  return createContainer(baseuri, NINRE_WorkSetServiceIndex, slug)
      .then(loc => {
        console.log("The LDP container GOLD doesn't currently support changes to the RDF in a container\n Add:\n\n <> <http://remix.numbersintonotes.net/vocab#working_sets> <" + loc + "> .\n\n to the .meta file in folder for "+loc+" in GOLD store.")
        return Promise.resolve(loc)
      })
}
module.exports.createWSIcontainer = createWSIcontainer

// return promise for creation of container
// type is uri, or currie using prefixes
function createContainer(baseuri, type, slug) {
  var containerTemplate = prefixes + `<> a ldp:BasicContainer, <${type}> . `
  var headers = {
      'Link': '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"',
      'Content-Type': 'text/turtle' }
  if (slug) headers['Slug'] = slug
  var p = axios.post(baseuri, containerTemplate, {
    headers: headers
  }).then(response => {
    console.log(response.status, response.headers.location)
    if (response.headers.location && response.headers.location[0]==='/') {
      // relative location add origin of baseuri
      var baseOrigin = new url.URL(baseuri).origin
      return Promise.resolve(baseOrigin+response.headers.location)
    }
    return Promise.resolve(response.headers.location)
  })

  return p
}
module.exports.createContainer = createContainer

function addAnnotation(conturi, targeturi, bodyuri, motivation) {
  if (! motivation) { motivation = MOTIVATION_ID }
  var annbody = prefixes + `<> a oa:Annotation ;
    oa:hasTarget <${targeturi}> ;
    oa:hasBody <${bodyuri}> ;
    oa:motivatedBy <${motivation}> .`

  return axios.post(conturi, annbody, {
      headers: {'Content-Type': 'text/turtle'}
    })
}
module.exports.addAnnotation = addAnnotation

function getNodeURI(node) {
  if (node === undefined) return undefined
  if (node.termType === "NamedNode") {
    return node.value
  }
  return undefined
}

function parseTurtle(baseuri) {
  return (res => {
    var store = rdf.graph()
    rdf.parse(res.data, store, baseuri, res.headers["content-type"])
    return Promise.resolve(store)
  })
}
module.exports.parseTurtle = parseTurtle

// Return Promise for contents of a location as rdf Store
function getTurtle(uri) {
  //console.log("uri:", uri)
  return (
    axios.get(uri, {responseType: 'text', headers: {'Accept':'text/turtle'}})
      .then(parseTurtle(uri))
      )
}
module.exports.getTurtle = getTurtle

// Return Promise for contents of LDP container 
function getLDPcontents(uri) {
  return (
    getTurtle(uri)
      .then(store => {
          let contents = store.each(rdf.sym(uri),
                                    rdf.sym('http://www.w3.org/ns/ldp#contains'),
                                    undefined)
          let uris = contents.map(getNodeURI)
          console.log(uri, "contents:", uris)
          return Promise.resolve(uris)
      } )
    )
}
module.exports.getLDPcontents = getLDPcontents

// Promise to get the Fragment URIs from a list of FragRefs
function getFragLocs(uris) {
  if (uris)
    return Promise.all(uris.map(uri => 
	          {console.log("GETLOC:", uri)
                  return ( getTurtle(uri)
                    .then(store => {
                       const fragnode = store.any(rdf.sym(uri), REMIX("fragment"), undefined)
		       console.log(uri, fragnode)
                       return Promise.resolve(getNodeURI(fragnode))
                     })
	            .catch(e=>{console.log(e);return Promise.resolve(undefined)})
		  )}
                ))
  else return Promise.resolve([])
}
module.exports.getFragLocs = getFragLocs

const get = p => o => p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o)
const getVal = get([0, 'object', 'value'])

// Promise to get info about the Fragment
function getFragInfo(uri) {
  //console.log("getinfo:", uri)
  return (
      getTurtle(uri)
        .then(frag => {
          let n = frag.match(undefined, DC("title"), undefined)
          let k = frag.match(undefined, NIN("key"), undefined)
          let m = frag.match(undefined, NIN("mode"), undefined)
          let l = frag.match(undefined, NIN("length"), undefined)
          let hn = frag.match(undefined, NIN("highNoteMidi"), undefined)
          let ln = frag.match(undefined, NIN("lowNoteMidi"), undefined)
          //let mei = frag.match(undefined, rdf.sym("http://purl.org/ontology/mo/published_as"), undefined)
          return { id: uri,
                   title: getVal(n),
                   key: getVal(k),
                   mode: getVal(m),
                   len: getVal(l),
                   highnote: parseInt(getVal(hn),10),
                   lownote: parseInt(getVal(ln),10)
                }
        })
    )
}
module.exports.getFragInfo = getFragInfo

// promise to fetch annotation from annuri
// check match to targeturi (if supplied)
//    (and if supplied to bodyuri)
// and return bodyuri (assumed to be a uri rather than literal)
function getAnnotation(annuri, targeturi = null, bodyuri = null) {
  //console.log("getAnn", annuri, targeturi)
  return axios.get(annuri, {responseType: 'text',
                             headers: {'Accept':'text/turtle'}})
    .then(parseTurtle(annuri))
    .then(graph => {
      let match = graph.any(rdf.sym(annuri),
                            rdf.sym('http://www.w3.org/ns/oa#hasTarget'))
      //console.log(match)
      if (!match) { 
        console.log("No target", annuri)
        return Promise.resolve(null)
      }
      if (targeturi) { // If have target check that it matches
        if (getNodeURI(match) !== targeturi) {
          console.log("nomatch for", targeturi)
          return Promise.resolve(null)
        }
      } else { // No targeturi given, fill in
        targeturi = getNodeURI(match)
      }
      match = graph.any(rdf.sym(annuri),
                        rdf.sym('http://www.w3.org/ns/oa#hasBody'))
      if (bodyuri) {
        // If a bodyuri supplied, check it matches
        if (bodyuri !== getNodeURI(match))
        return Promise.resolve(null)
      }
      let motivation = graph.any(rdf.sym(annuri),
                             rdf.sym('http://www.w3.org/ns/oa#motivatedBy'))
      return Promise.resolve({ body: getNodeURI(match),
                               motivation: getNodeURI(motivation),
                               uri: annuri,
                               target: targeturi
                             })
      })
}

function promiseUntil(cond, combine, action, arg) {
  return new Promise((resolve, reject) => {
    action(arg).then(r => {
      if (cond(r, arg)) { resolve(r) }
      else {
        resolve(promiseUntil(cond, combine, action, combine(arg, r)))
      }})
  })
}
module.exports.promiseUntil = promiseUntil

// Scan an annotation container and look for body
// of matched target uri.
// return promise
function findAnnotation(conturi, targeturi) {
  var p = axios.get(conturi, {responseType: 'text',
                              headers:{'Accept':'text/turtle'}})
      .then(parseTurtle(conturi)).then(graph => {
      //extract content URIs from LDP container graph
      //console.log(graph)
      var matches = graph.each(rdf.sym(conturi),
                               rdf.sym('http://www.w3.org/ns/ldp#contains'),
                               undefined)
      var uris = matches.map(getNodeURI)
      console.log(conturi, "contains:", uris)
      return Promise.resolve(uris)
    }).then(uris => {
      // fetch annotations from the URIs
      // until one matches
      // promiseUntil (condition, combineFn, action, initialArg)
      return promiseUntil((r, arg)=>(r !== null || arg.length === 0),
                          arg=>(arg.slice(1)),
                          arg=>{
                            if (arg.length >0) return getAnnotation(arg[0], targeturi)
                            else return Promise.resolve(null)
                          },
                          uris)
    })
    //.then(o => {console.log(o)})
  return p
}
module.exports.findAnnotation = findAnnotation

// Promise to look for an existing annotation
//  and either return it or null
function findExistingAnn(cont, target, body) {
  let p = getLDPcontents(cont)
    .then(uris => {
      return promiseUntil((r, arg)=>(r !== null || arg.length === 0),
                          arg=>(arg.slice(1)),
                          arg=>{
                            if (arg.length >0)
                              return getAnnotation(arg[0], target, body)
                            else return Promise.resolve(null)
                          },
                          uris)
    })
  return p
}
module.exports.findExistingAnn = findExistingAnn

// Find Annotation, recursing if motivation is 'redirect'
function findAnnotationR(conturi, targeturi) {
  var p = axios.get(conturi, {responseType: 'text',
                              headers:{'Accept':'text/turtle'}})
      .then(parseTurtle(conturi)).then(graph => {
      //extract content URIs from LDP container graph
      //console.log(graph)
      var matches = graph.each(rdf.sym(conturi),
                               rdf.sym('http://www.w3.org/ns/ldp#contains'),
                               undefined)
      var uris = matches.map(getNodeURI)
      console.log(conturi, "contains:", uris)
      return Promise.resolve(uris)
    }).then(uris => {
      // fetch annotations from the URIs
      // until one matches
      // promiseUntil (condition, combineFn, action, initialArg)
      return promiseUntil((r, arg)=>(r !== null || arg.length === 0),
                          arg=>(arg.slice(1)),
                          arg=>{
                            if (arg.length >0) return getAnnotation(arg[0], targeturi)
                            else return Promise.resolve(null)
                          },
                          uris)
    }).then(r => {
      // Add check for 'redirect' motivation, recurse if necessary
      if (r === null) return Promise.resolve(null)
      if (r.motivation === MOTIVATION_RECURSE)
        return findAnnotationR(r.body, targeturi)
      else
        return Promise.resolve(r)
    })
    //.then(o => {console.log(o)})
  return p
}
module.exports.findAnnotationR = findAnnotationR

function findMatchService(wsi, matchtype, workset) {
   var p = findAnnotation(wsi, workset)
      .then( ({body})=>
          findAnnotation(body, matchtype))
      .then( ({body}) =>
          Promise.resolve(body))
   return p
}
module.exports.findMatchService = findMatchService

function getAnnotations(conturi) {
  var p = axios.get(conturi, {responseType: 'text',
                              headers:{'Accept':'text/turtle'}})
      .then(parseTurtle(conturi)).then(graph => {
      //extract content URIs from LDP container graph
      var matches = graph.each(rdf.sym(conturi),
                               rdf.sym('http://www.w3.org/ns/ldp#contains'),
                               undefined)
      var uris = matches.map(getNodeURI)
      //console.log(conturi, "contains:", uris)
      return Promise.resolve(uris)
    }).then(uris =>
      // fetch annotations from the URIs
      Promise.all(uris.map(u=>(
               getAnnotation(u)
                .then(a=>{
                  if (a && a.motivation === MOTIVATION_RECURSE)
                    { return getAnnotation(a.body) }
                  else if (a) { return a }
                  else { return null }
                })
                .catch(e => {return e})
               //.then(idlog)
         )))
         //.then(idlog)
         // flatten the list (from recursive call)
         // and filter out nulls
         .then(anns=>anns.reduce((a,v)=> a.concat(v),[]).filter(a=>a))
    )
  return p
}
module.exports.getAnnotations = getAnnotations

// Find Matches for target in container
// returns a list of matches for target, handling recursion if necessary
function findAnnotationMatches(conturi, targeturi) {
  var p = axios.get(conturi, {responseType: 'text',
                              headers:{'Accept':'text/turtle'}})
      .then(parseTurtle(conturi)).then(graph => {
      //extract content URIs from LDP container graph
      //console.log(graph)
      var matches = graph.each(rdf.sym(conturi),
                               rdf.sym('http://www.w3.org/ns/ldp#contains'),
                               undefined)
      var uris = matches.map(getNodeURI)
      console.log(conturi, "contains:", uris)
      return Promise.resolve(uris)
    }).then(uris =>
      // fetch annotations from the URIs
      // checking matches
      Promise.all(uris.map(u=>(
               getAnnotation(u, targeturi)
                .then(a=>{
                  if (a && a.motivation === MOTIVATION_RECURSE)
                    { return findAnnotationMatches(a.body, targeturi) }
                  else if (a) { return a.body }
                  else { return null }
                })
                .catch(e => {return e})
               //.then(idlog)
         )))
         //.then(idlog)
         // flatten the list (from recursive call)
         // and filter out nulls
         .then(anns=>anns.reduce((a,v)=> a.concat(v),[]).filter(a=>a))
    )
    //  .then(idlog)
  return p
}
module.exports.findAnnotationMatches = findAnnotationMatches

// Creates promise to find an annotation pointing to targetUri
// in the LDP container outerContUri
// if not existing create a new container within baseuri and add annotation
// pointing to it
//
// slug and motivation will have defaults if not supplied
function findOrCreateContainer(outerContUri, targetUri,
                               baseuri, typeuri,
                               slug, motivation = MOTIVATION_ID) {
  let p = findAnnotation(outerContUri, targetUri)
      .then(r => {
         if (r) { return r }
         return createContainer(baseuri, typeuri, slug)
                .then(loc => {
                    console.log(outerContUri, targetUri, loc, motivation)
                    let p = addAnnotation(outerContUri, targetUri, loc, motivation)
                     .then( ()=>({body: loc,
                                  motivation: motivation,
                                  created: true
                                  }) ) //TODO motivation is curie not uri
                    return p
                   }
                 )

      })
  return p
}
module.exports.findOrCreateContainer = findOrCreateContainer

function getMatchServices(wsi, workset) {
  let p = findAnnotation(wsi, workset)
     .then( ({body})=> getLDPcontents(body))
     .then( uris => Promise.all(uris.map(uri =>
         getTurtle(uri)
         .then(store=> {
           const target = store.any(rdf.sym(uri), rdf.sym('http://www.w3.org/ns/oa#hasTarget'), undefined)
           return Promise.resolve(getNodeURI(target))
         }))) )
  return p
}
module.exports.getMatchServices = getMatchServices

function getAvailInstruments(wsi, workset) {
  console.log(wsi, workset)
  let p = findMatchService(wsi, INSTRUMENT_SERVICE, workset)
      .then( servloc => getLDPcontents(servloc))
      .then( uris => Promise.all(uris.map(uri =>
          getTurtle(uri)
          .then(store => {
             const target = store.any(rdf.sym(uri), rdf.sym('http://www.w3.org/ns/oa#hasTarget'), undefined)
             return Promise.resolve(getNodeURI(target))
          } ))))
  return p
}
module.exports.getAvailInstruments = getAvailInstruments
