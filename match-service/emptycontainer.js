
var cserv = require('./matchservice-utils.js');
var axios = require('axios');

var arg = process.argv[2]

function idlog(x) {
        console.log(x)
        return x
}

function go(cont) {
  cserv.getLDPcontents(cont)
    .then(uris => {
      for (let u of uris) {
        axios.delete(u)
          .then(console.log("deleted:", u))
      }
    })
}

if (arg)
  go(arg)
else
  console.log("Use container location as argument.")
