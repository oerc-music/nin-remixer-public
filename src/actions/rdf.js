import axios from 'axios'
import rdf from 'rdflib'

// Functions to handle RDF

//function test() {
//  var store = rdf.graph()
//  var t = store.any(undefined, rdf.sym('http://xmlns.com/foaf/0.1/knows'))
//  console.log(store.length)
//}

function getNodeURI(node) {
  if (node === undefined) return undefined
  if (node.termType === "NamedNode") {
    return node.value
  }
  return undefined
}

// eslint-disable-next-line
function getNodeLit(node) {
  if (node === undefined) return undefined
  if (node.termType === "Literal") {
    return node.value
  }
  return undefined
}

// Return Promise for contents of a location as rdf Store
export function getTurtle(uri) {
  return (
    axios.get(uri, {responseType: 'text', headers: {'Accept':'text/turtle'}})
      .then(response => {
          var store = rdf.graph()
          rdf.parse(response.data, store, uri, response.headers["content-type"])
          return store
        } )
      )
}

// Return Promise for contents of LDP container 
export function getLDPcontents(uri) {
  return (
    getTurtle(uri)
      .then(store => {
          var contents = store.each(rdf.sym(uri),
                                    rdf.sym('http://www.w3.org/ns/ldp#contains'),
                                    undefined)
          var uris = contents.map(getNodeURI)
          console.log(uri, "contents:", uris)
          return uris
      } )
    )
}

const REMIX = rdf.Namespace("http://remix.numbersintonotes.net/vocab#")
const DC = rdf.Namespace("http://purl.org/dc/elements/")
const NIN = rdf.Namespace("http://numbersintonotes.net/terms#")

const get = p => o => p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o)

const getVal = get([0, 'object', 'value'])

function idlog(x) {
        console.log(x)
        return x
}

export function getFragInfo(uri) {
  return (
      getTurtle(uri)
        .then(store => {
          const fragnode = store.any(rdf.sym(uri), REMIX("fragment"), undefined)
          return getNodeURI(fragnode)
        })
        .then(furi => {
          return getTurtle(furi).then(ttl=>({furi:furi, frag:ttl}))
        })
        //.then(idlog)
        .then(({furi, frag}) => {
          //var n= frag.statementsMatching(undefined, DC("title"), undefined)
          let n= frag.match(undefined, DC("title"), undefined)
          let k = frag.match(undefined, NIN("key"), undefined)
          let m = frag.match(undefined, NIN("mode"), undefined)
          let mei = frag.match(undefined, rdf.sym("http://purl.org/ontology/mo/published_as"), undefined)

          //console.log(get([0, 'object', 'value'])(n) )
          return { id: furi,
                   fragref: uri,
                   title: get([0, 'object', 'value'])(n),
                   key: getVal(k),
                   mode: getVal(m),
                   mei: getVal(mei)
                }
        })
    )
}

