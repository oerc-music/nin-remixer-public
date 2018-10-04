import MIDI from 'midi.js'
var MidiWriter = require('midi-writer-js')

const testtrack = 'data:audio/mid;base64,TVRoZAAAAAYAAQABAMBNVHJrAAAARwD/WAQEAhgIAP9RAwehIAD/AwlOZXcgVHJhY2sAwHMAkDxkMoA8MIEOkDxkMoA8MIEOkDxkMoA8MIEOkDxkgT+APDAB/y8A'

let mw = MidiWriter

function midiTest() {
  console.log("TESTMIDI - LOAD DONE")

  let track = new mw.Track()
  track.addEvent(new mw.ProgramChangeEvent({instrument: 40}))
  let note = new mw.NoteEvent({pitch:['C4', 'D4', 'E4'], duration: '4'})
  let note2 = new mw.NoteEvent({pitch:'C4', duration: '4'})
  track.addEvent(note)
  track.addEvent(note)
  track.addEvent(note2)
  //track.addEvent(note)
  //track.addEvent(note2)
  
  let track2 = new mw.Track()
  // Instrument numbers from https://en.wikipedia.org/wiki/General_MIDI
  // Offset by 1 as 0-based
  // 0 Piano
  // 24 Guitar
  // 40 Violin
  track2.addEvent(new mw.ProgramChangeEvent({instrument: 0}))
  track2.addEvent(new mw.NoteEvent({pitch: 'G3', duration: '2'}))
  track2.addEvent(new mw.NoteEvent({pitch: 'G3', duration: '2'}))
  track2.addEvent(new mw.NoteEvent({pitch: 'A5', duration: '2'}))
  track2.addEvent(new mw.NoteEvent({pitch: 'C5', duration: '2'}))
  track2.addEvent(new mw.NoteEvent({pitch: 'A5', duration: '2'}))
  track2.addEvent(new mw.NoteEvent({pitch: 'C5', duration: '2'}))

  let write = new mw.Writer([track, track2]);
  let out = write.dataUri()
  console.log(out)

  //MIDI.noteOn(0, 60, 127, 0)
  //MIDI.noteOn(0, 63, 127, 1)
  //MIDI.noteOn(0, 65, 127, 1)
  var player=MIDI.Player
  player.timewarp=1
  player.loadFile(out, player.start)
}

export const goTest = e=>{
  console.log("TEST MIDI")
  
  // Available instruments listed in instruments-fluidR3.json
  MIDI.loadPlugin({
    soundfontUrl: "http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/",
    instruments: [ "acoustic_grand_piano", "acoustic_guitar_nylon", "violin" ],
    onsuccess: midiTest
  })
}


