
var cserv = require('./matchservice-utils.js');
var axios = require('axios');

var arg = process.argv[2]

function idlog(x) {
        console.log(x)
        return x
}

function go(cont) {
  cserv.getLDPcontents(cont)
    .then(cserv.getFragLocs)
    .then(uris => {
      for (let u of uris) {
         console.log(u)
      }
    })
}

if (arg)
  go(arg)
else
  console.log("Use workset location as argument.")
