
var cserv = require('./matchservice-utils.js');

const base = 'http://localhost:8080/ninbase/'
const wsi = 'http://localhost:8080/ninbase/WSI/'

const WSS_TYPE = "http://remix.numbersintonotes.net/vocab#WorkSetService"
const MS_TYPE = "http://remix.numbersintonotes.net/vocab#MatchService"
const keymatch = 'http://remix.numbersintonotes.net/vocab#keyCompatibility'

//const ws = 'http://test/workset1/'
const ws0 = 'http://test/workset2/'
const ws1 = 'http://localhost:8080/newworkset/'
//const targetFrag = "http://beta.numbersintonotes.net/meld/c59ef00f-1ade-4d16-9eec-ee38971bc1ca.ttl" 
const targetFrag = "http://beta.numbersintonotes.net/meld/ce4bef91-131c-4a12-ae67-e7d33b4ca463.ttl"

//cserv.findAnnotation(wsi, ws0)

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

function getOrCreateKeyMatch(ws) {
  return (
    cserv.findOrCreateContainer(wsi, ws, base, WSS_TYPE, 'WSS')
      //.then(idlog)
      .then( ({body}) =>
              cserv.findOrCreateContainer(body, keymatch, base, MS_TYPE, 'MS') )
      .then(idlog)
      .catch(e=>console.log(e))
   )
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
async function doAnnotations(ws, tfragid) {
  const cont = await getOrCreateKeyMatch(ws)
  const frags = await getFrags(ws)
  console.log(cont, frags)
  const tfrag = await cserv.getFragInfo(tfragid)
  console.log(tfrag)

  const compatKeys = compat(tfrag.key, tfrag.mode == "minor")
  console.log(compatKeys)

  for (let f of frags) {
    if (keyCompatible(compatKeys, tfrag, f)) {
       console.log( "compatible:", tfrag.id, f.id)
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

doAnnotations(ws1, targetFrag)
  .catch(e=>console.log(e))
