var axios = require('axios');
var rdf = require('rdflib');

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
const MOTIVATION_ID = 'oa:linking'

const REMIX = rdf.Namespace("http://remix.numbersintonotes.net/vocab#")
const DC = rdf.Namespace("http://purl.org/dc/elements/")
const NIN = rdf.Namespace("http://numbersintonotes.net/terms#")

function idlog(x) {
        console.log(x)
        return x
}

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
    oa:motivatedBy ${motivation} .`

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

// Return Promise for contents of a location as rdf Store
function getTurtle(uri) {
  //console.log("uri:", uri)
  return (
    axios.get(uri, {responseType: 'text', headers: {'Accept':'text/turtle'}})
      .then(parseTurtle(uri))
      )
}

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
                  getTurtle(uri)
                    .then(store => {
                       const fragnode = store.any(rdf.sym(uri), REMIX("fragment"), undefined)
                       return Promise.resolve(getNodeURI(fragnode))
                     })
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
          //let mei = frag.match(undefined, rdf.sym("http://purl.org/ontology/mo/published_as"), undefined)
          return { id: uri,
                   title: getVal(n),
                   key: getVal(k),
                   mode: getVal(m),
                   len: getVal(l),
                   //mei: getVal(mei)
                }
        })
    )
}
module.exports.getFragInfo = getFragInfo

// promise to fetch annotation from annuri
// check match to targeturi
//    (and if supplied to bodyuri)
// and return bodyuri (assumed to be a uri rather than literal)
function getAnnotation(annuri, targeturi, bodyuri = null) {
  //console.log("getAnn", annuri, targeturi)
  return axios.get(annuri, {responseType: 'text',
                             headers: {'Accept':'text/turtle'}})
    .then(parseTurtle(annuri))
    .then(graph => {
      let match = graph.any(rdf.sym(annuri),
                            rdf.sym('http://www.w3.org/ns/oa#hasTarget'))
      //console.log(match)
      if (!match || getNodeURI(match) !== targeturi) {
        console.log("nomatch for", targeturi)
        return Promise.resolve(null)
      }
      match = graph.any(rdf.sym(annuri),
                        rdf.sym('http://www.w3.org/ns/oa#hasBody'))
      if (bodyuri) {
        // If a bodyuri supplied, check it matches
        if (bodyuri != getNodeURI(match))
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
      return promiseUntil((r, arg)=>(r !== null || arg.length == 0),
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
      return promiseUntil((r, arg)=>(r !== null || arg.length == 0),
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
      return promiseUntil((r, arg)=>(r !== null || arg.length == 0),
                          arg=>(arg.slice(1)),
                          arg=>{
                            if (arg.length >0) return getAnnotation(arg[0], targeturi)
                            else return Promise.resolve(null)
                          },
                          uris)
    }) // Add check for 'redirect' motivation, recurse if necessary
    //.then(o => {console.log(o)})
  return p
}
//module.exports.findAnnotation = findAnnotation

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


