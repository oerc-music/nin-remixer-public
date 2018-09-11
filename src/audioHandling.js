import MIDI from 'midi.js'
//import MidiWriter from 'midi-writer-js'
var MidiWriter = require('midi-writer-js')

export function extractNotesMEI(mei) {
  let parser = new DOMParser()
  let xml = parser.parseFromString(mei, "text/xml")

  let notes = []
  let rest = ["4"]
  let meas = xml.getElementsByTagName("measure")
  for (let m of meas) {
    //console.log(m)
    let noteElms = m.getElementsByTagName("layer")[0].children
    for (let n of noteElms) {
      //console.log(n)
      if (n.nodeName === "note") {
        let a = n.attributes
        console.log("NOTE", a.pnum, a.pname, a.oct, a.dur)
        // Assume duration specified in CMN compatible with midi library
        // TO-FIX
        if (rest.length > 0) {
          notes.push(new MidiWriter.NoteEvent({pitch: parseInt(a.pnum.value, 10),
                                               duration: a.dur.value,
                                               wait: rest}))
          rest = []
        } else {
          notes.push(new MidiWriter.NoteEvent({pitch: parseInt(a.pnum.value, 10),
                                               duration: a.dur.value }))
        }
      }
      if (n.nodeName === "rest") {
        let a = n.attributes
        console.log("REST", a.dur)
        // Assume duration specified in CMN compatible with midi library
        // TO-FIX
        rest.push(a.dur.value)
      }
    } // for n
  } // for m
  return notes
}

export function createMidiMEI(mei) {
  let notes = extractNotesMEI(mei)
  let track = new MidiWriter.Track()
  //track.addEvent(notes[0])
  for (var i=0;i<notes.length; i++) {
    //if (i===1) {track.addEvent(notes[i])}
    track.addEvent(notes[i])
  }
  let writer = new MidiWriter.Writer([track])
  let data = writer.dataUri()
  console.log(data)
  return data
}

export function playMei(mei) {
  let midiDat = createMidiMEI(mei)
  //MIDI.Player.timewarp = 1
  MIDI.Player.loadFile(midiDat, MIDI.Player.start)
}

export function midiStart() {
  MIDI.Player.start()
}

export function initMidi() {
  MIDI.loadPlugin({
    soundfontUrl: "http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/",
    instruments: [ "acoustic_grand_piano", "acoustic_guitar_nylon", "violin" ],
    onsuccess: ()=>{console.log("MIDI Loaded")}
  })

}

