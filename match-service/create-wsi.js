
var cserv = require('./matchservice-utils.js');

var conf = require('./getConfig.js');

console.log(conf)

cserv.createWSIcontainer(conf.base, "WSI")
  .catch(e => console.log(e))
