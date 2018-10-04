
let serviceLabels = new Map([
                  ["http://remix.numbersintonotes.net/vocab#lengthCompatibility", "Matching Length],
                  ["http://remix.numbersintonotes.net/vocab#instrumentCompatibility", "Compatible Instrument"],
                  ["http://remix.numbersintonotes.net/vocab#keyCompatibility", "Key Compatibility"] ])

let instrumentLabels = new Map([
     [ 'http://fast-project.annalist.net/annalist/c/FAST_musical_instruments_catalogue/d/Instrument/violoncello/entity_data.ttl', 'Cello' ],
     [ 'http://fast-project.annalist.net/annalist/c/FAST_musical_instruments_catalogue/d/Instrument/clarinet/entity_data.ttl', 'Clarinet' ],
     [ 'http://fast-project.annalist.net/annalist/c/FAST_musical_instruments_catalogue/d/Instrument/violin/entity_data.ttl', 'Violin' ],
     [ 'http://fast-project.annalist.net/annalist/c/FAST_musical_instruments_catalogue/d/Instrument/viola/entity_data.ttl', 'Viola' ],
     [ 'http://fast-project.annalist.net/annalist/c/FAST_musical_instruments_catalogue/d/Instrument/banjo/entity_data.ttl', 'Banjo' ],
     [ 'http://fast-project.annalist.net/annalist/c/FAST_musical_instruments_catalogue/d/Instrument/tuba/entity_data.ttl', 'Tuba' ]
    ])

function matchServiceLabel(uri) {
  let m = serviceLabels.get(uri)
  if (!m) { console.log("No Label for:", uri)}
  return m
}
module.exports.matchServiceLabel = matchServiceLabel

