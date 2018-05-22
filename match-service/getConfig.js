
var localconf = {}

try {
  localconf = require('../conf.js');
} catch (e) {
  // looks like conf.js doesn't exist
  // add some basic defaults
  localconf.base = 'http://localhost:8080/matchbase/'
  localconf.wsi = 'http://localhost:8080/matchbase/WSI/'
}

module.exports = localconf
