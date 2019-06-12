
var cserv = require('./matchservice-utils.js')
var axios = require('axios')
var _ = require('lodash')
var LinkHeader = require( 'http-link-header' )

var arg = process.argv[2]

function idlog(x) {
        console.log(x)
        return x
}

function rec(cont) {
  var prom = cserv.getLDPcontents(cont)
               .then(uris => Promise.all(uris.map( u => go(u) )))
  return prom
}


function go(u) {
    var prom =  axios.head(u)
                     .then(r=>{
                         if (!r.headers.link) {
                             console.log("Can't identify:",u)
                             console.log("Will try deleting")
                             return axios.delete(u)
                         }
                         //console.log(r.headers.link)
                         var links = LinkHeader.parse(r.headers.link)
                         //console.log(links)
                         if (_.find(links.refs, ['uri', 'http://www.w3.org/ns/ldp#Container'])) {
                             console.log("Found container:", u)
                             return ( rec(u)
                                        .then(()=>{
                                            axios.delete(u)
                                            console.log("deleted container:", u)
                                      })
                                    )
                         } else {
                             console.log("Found resource:", u)
                             return ( axios.delete(u)
                                        .then(console.log("deleted:", u))
                                    )
                         }
                     })
    return prom
}

if (arg)
  go(arg)
else
  console.log("Use container location as argument.")
