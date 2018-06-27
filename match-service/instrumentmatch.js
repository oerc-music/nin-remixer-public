
var cserv = require('./matchservice-utils.js');
var rdf = require('rdflib');

var conf = require('./getConfig.js');

const base = conf.base
const wsi = conf.wsi

const WSS_TYPE = "http://remix.numbersintonotes.net/vocab#WorkSetService"
const MS_TYPE = "http://remix.numbersintonotes.net/vocab#MatchService"
const LENMATCH = 'http://remix.numbersintonotes.net/vocab#lengthCompatibility'
const INSTMATCH = 'http://remix.numbersintonotes.net/vocab#instrumentCompatibility'
const MOTIVATION_RECURSE ='http://remix.numbersintonotes.net/vocab#seeHere'

const REMIX = rdf.Namespace("http://remix.numbersintonotes.net/vocab#")
const DC = rdf.Namespace("http://purl.org/dc/elements/")
const NIN = rdf.Namespace("http://numbersintonotes.net/terms#")
const RDFS = rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#")
const SOFA = rdf.Namespace("http://meld.linkedmusic.org/sofa/terms/")

const workset = process.argv[2]
const targetInst = process.argv[3]

function idlog(x) {
        console.log(x)
        return x
}

function getFrags(ws) {
  return (
     cserv.getLDPcontents(ws)
       //.then(idlog)
       .then(cserv.getFragLocs)
       //.then(idlog)
       .then(uris => Promise.all(uris.map(cserv.getFragInfo)))
       //.then(idlog)
       .catch(e=>console.log(e))
   )
}

function getOrCreateMatchSubCont(ws, inst) {
  return (
    cserv.findOrCreateContainer(wsi, ws, base, WSS_TYPE, 'WSS')
      //.then(idlog)
      .then( ({body}) =>
              cserv.findOrCreateContainer(body, INSTMATCH, base, MS_TYPE, 'MS') )
      .then(idlog)
      // look for or create sub container for instrument
      // TODO check motivation is right before returning
      .then( ({body}) =>
              cserv.findOrCreateContainer(body, inst, base, MS_TYPE, 'MSR', MOTIVATION_RECURSE))
      .then(idlog)
      .catch(e=>console.log(e))
   )
}

const get = p => o => p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o)
const getVal = get([0, 'object', 'value'])

function getInstInfo(uri) {
  return (
    cserv.getTurtle(uri)
      .then(inst => {
         // Needs first undefined in pattern as data at
         // http://fast-project.annalist.net/annalist/c/FAST_musical_instruments_catalogue/d/Instrument/clarinet/entity_data.ttl
         // but refers to
         // http://fast-project.annalist.net/annalist/c/FAST_musical_instruments_catalogue/d/Instrument/clarinet
         let n = inst.match(undefined, RDFS("label"), undefined)
         let u = inst.match(undefined, SOFA("maxMidi"), undefined)
         let l = inst.match(undefined, SOFA("minMidi"), undefined)
         return { id: uri,
                  name: getVal(n),
                  maxmidi: parseInt(getVal(u)),
                  minmidi: parseInt(getVal(l))
                }
      })
  )
}

function instCompatible(inst, frag) {
        return (frag.highnote <= inst.maxmidi
                 && frag.lownote >= inst.minmidi)
}

async function doAnnotations(ws, tid) {
  const cont = await getOrCreateMatchSubCont(ws, tid)
  const frags = await getFrags(ws)
  console.log(cont, frags)
  const instinfo = await getInstInfo(tid)
  console.log(instinfo)

  for (let f of frags) {
    if (instCompatible(instinfo, f)) {
       console.log( "instrument compatible:", f.id, tid)
       // Add Annotation 
       let exists = await cserv.findExistingAnn(cont.body, tid, f.id)
       if (exists)
         console.log("Ann already exists:", tid, f.id)
       else
         await cserv.addAnnotation(cont.body, tid, f.id)
    }
  }
}

doAnnotations(workset, targetInst)
  .catch(e=>console.log(e))
