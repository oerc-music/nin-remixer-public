
var localconf = {}

try {
  localconf = require('../conf.js');
} catch (e) {
  // looks like conf.js doesn't exist
  // add some basic defaults
  localconf.base = 'http://localhost:8080/matchbase/'
  localconf.wsi = 'http://localhost:8080/matchbase/WSI/'
}

let narg = 2

if (process.argv[narg] === "ALL" || process.argv[narg] === "-a") {
  localconf.doAll = true
  narg += 1
} else {
  localconf.doAll = false
}

if (process.argv[narg]) {
  localconf.targetWorkset = process.argv[narg]
  narg += 1
}

if (localconf.doAll && process.argv[narg]) {
  localconf.targetFrag = process.argv[narg]
}

module.exports = localconf
