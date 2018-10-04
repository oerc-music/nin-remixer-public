
let serviceLabels = new Map([
                  ["http://remix.numbersintonotes.net/vocab#lengthCompatibility", "Matching Length],
                  ["http://remix.numbersintonotes.net/vocab#instrumentCompatibility", "Compatible Instrument"],
                  ["http://remix.numbersintonotes.net/vocab#keyCompatibility", "Key Compatibility"] ])

let instrumentLabels = new Map([
    ])

function matchServiceLabel(uri) {
  let m = serviceLabels.get(uri)
  if (!m) { console.log("No Label for:", uri)}
  return m
}
module.exports.matchServiceLabel = matchServiceLabel

