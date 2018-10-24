
var cserv = require('./matchservice-utils.js');

var conf = require('./getConfig.js');

const base = conf.base
const wsi = conf.wsi

const WSS_TYPE = "http://remix.numbersintonotes.net/vocab#WorkSetService"
const MS_TYPE = "http://remix.numbersintonotes.net/vocab#MatchService"
const keymatch = 'http://remix.numbersintonotes.net/vocab#keyCompatibility'

//const ws1 = conf.targetWorkset
//const workset = process.argv[2]
//const targetFrag = process.argv[3]

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
              cserv.findOrCreateContainer(body, keymatch, base, MS_TYPE, 'MS') )
      .then(idlog)
      .catch(e=>console.log(e))
   )
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

function compat(key, minor) {
  var order = ["C", "G", "D", "A", "E", "B", "F#", "C#", "Ab", "Eb", "Bb", "F"];
  var ind = order.indexOf(key);
  var nextind = (ind+1) % order.length;
  var prevind = (order.length+ind-1) % order.length;
  var minorind = (order.length + ind + (minor ? -3 : 3)) % order.length;
  function dec(x, m) {return x + (m?"minor":"");}
  return [dec(key, minor), dec(order[nextind],minor),
          dec(order[prevind],minor), dec(order[minorind],!minor)];
}

function keyCompatible(compatKeys, tfrag, frag) {
        // temp
        //return !(tfrag.id == frag.id)
        let keytag = frag.key+(frag.mode=="minor"?"minor":"")
        return (-1 != compatKeys.indexOf(keytag))
}


// Have: uri: new fragment URI
//       ws: workset URI
//
// * get container location
// * get current FragmentList
// * get fragment key
// * for each fragment:
//      * get fragment key
//      * check compatibility
//      * add annotation (check if exists)
async function doAnnotations(cont, ws, tfragid) {
  const frags = await getFrags(ws)
  //console.log("MCONT+FRAGS", cont, frags)
  const tfrag = await cserv.getFragInfo(tfragid)
  //console.log("TARGET FRAG", tfrag)

  const compatKeys = compat(tfrag.key, tfrag.mode == "minor")
  //console.log(compatKeys)

  for (let f of frags) {
    if (keyCompatible(compatKeys, tfrag, f)) {
       console.log( "compatible:", tfrag.id, f.id)
       console.log(f.key, f.mode)
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
