
var cserv = require('./matchservice-utils.js');

var conf = require('./getConfig.js');

const base = conf.base
const wsi = conf.wsi

const WSS_TYPE = "http://remix.numbersintonotes.net/vocab#WorkSetService"
const MS_TYPE = "http://remix.numbersintonotes.net/vocab#MatchService"
const LENMATCH = 'http://remix.numbersintonotes.net/vocab#lengthCompatibility'

const ws1 = conf.targetWorkset
//const targetFrag = conf.targetFrag

const workset = process.argv[2]
const targetFrag = process.argv[3]

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
       .then(idlog)
       .catch(e=>console.log(e))
   )
}

function getOrCreateMatchCont(ws) {
  return (
    cserv.findOrCreateContainer(wsi, ws, base, WSS_TYPE, 'WSS')
      //.then(idlog)
      .then( ({body}) =>
              cserv.findOrCreateContainer(body, LENMATCH, base, MS_TYPE, 'MS') )
      .then(idlog)
      .catch(e=>console.log(e))
   )
} 

function lenCompatible(tfrag, frag) {
        return tfrag.len == frag.len
}

async function doAnnotations(ws, tfragid) {
  const cont = await getOrCreateMatchCont(ws)
  const frags = await getFrags(ws)
  console.log(cont, frags)
  const tfrag = await cserv.getFragInfo(tfragid)
  console.log(tfrag)

  for (let f of frags) {
    if (lenCompatible(tfrag, f)) {
       console.log( "length equal:", tfrag.id, f.id)
       console.log(f.key, f.mode)
       // Add Annotation 
       let exists = await cserv.findExistingAnn(cont.body, tfrag.id, f.id)
       if (exists)
         console.log("Ann already exists:", tfrag.id, f.id)
       else
         await cserv.addAnnotation(cont.body, tfrag.id, f.id)
    }
  }
}

doAnnotations(workset, targetFrag)
  .catch(e=>console.log(e))
