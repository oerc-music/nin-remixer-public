
var cserv = require('./matchservice-utils.js');
var axios = require('axios');

var wsi = process.argv[2]
var wset = process.argv[3]
var mtype = process.argv[4]

function idlog(x) {
        console.log(x)
        return x
}

function go(wsi, wset, mtype) {
 cserv.findMatchService(wsi, mtype, wset)
   .then(idlog)
}

if (wsi && wset && mtype)
  go(wsi, wset, mtype)
else
  console.log("Specify WSI, WORKSET and MATCHTYPE as arguments.")
