
var cserv = require('./matchservice-utils.js');

var conf = require('./getConfig.js');

const base = conf.base
const wsi = conf.wsi

const WSS_TYPE = "http://remix.numbersintonotes.net/vocab#WorkSetService"
const MS_TYPE = "http://remix.numbersintonotes.net/vocab#MatchService"
const LENMATCH = 'http://remix.numbersintonotes.net/vocab#lengthCompatibility'

const targetFrag = conf.targetFrag
const workset = conf.targetWorkset

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

var matchCache = new Set()

async function setupContainer(ws) {
  const cont = await getOrCreateMatchCont(ws)
  console.log("CONT:",cont)
  const exmatches = await cserv.getAnnotations(cont.body)
  //console.log(exmatches)
  for (let mi in exmatches) {
     let m = exmatches[mi]
     console.log("Adding to cache:", m.target, m.body)
     matchCache.add(m.target+" "+m.body)
  }
  return cont
}

async function doAnnotations(cont, ws, tfragid) {
  const frags = await getFrags(ws)
  //console.log("MCONT+FRAGS", cont, frags)
  const tfrag = await cserv.getFragInfo(tfragid)
  //console.log("TARGET FRAG", tfrag)

  for (let f of frags) {
    if (lenCompatible(tfrag, f)) {
       console.log( "length equal:", tfrag.id, f.id)
       //console.log(f.key, f.mode)
       // Add Annotation 
       //let exists = await cserv.findExistingAnn(cont.body, tfrag.id, f.id)
       let exists = matchCache.has(tfrag.id+" "+f.id)
       if (exists)
         console.log("Ann already exists:", tfrag.id, f.id)
       else { // Doesn't exist so add
         await cserv.addAnnotation(cont.body, tfrag.id, f.id)
         matchCache.add(tfrag.id+" "+f.id)
       }
    }
  }
}

async function doAll(cont, workset) {
  const frags = await getFrags(workset)
  for (let tfrag of frags) {
    console.log("ANNOTATIONS FOR:", tfrag.id)
    await doAnnotations(cont, workset, tfrag.id)
  }
}

if (conf.doAll) {
  setupContainer(workset)
  .then(cont=>
    doAll(cont, workset)
   )
  .catch(e=>console.log(e))
} else {
  setupContainer(workset)
  .then(cont =>
    doAnnotations(cont, workset, targetFrag)
   )
  .catch(e=>console.log(e))
}
