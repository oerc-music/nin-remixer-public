
var cserv = require('./matchservice-utils.js');
var axios = require('axios');

var cont = process.argv[2]
var targ = process.argv[3]

function idlog(x) {
        console.log(x)
        return x
}

function go(cont, targ) {
 cserv.findAnnotationMatches(cont, targ)
   .then(idlog)
}

if (cont && targ)
  go(cont, targ)
else
  console.log("Specify CONTAINER and TARGET as arguments.")
