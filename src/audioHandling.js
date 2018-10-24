import MIDI from 'midi.js'
import Soundfont from 'soundfont-player'
//
//import MidiWriter from 'midi-writer-js'
var MidiWriter = require('midi-writer-js')

//const useMIDIjs = true
const useMIDIjs = false

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
  if (useMIDIjs)
          playMeiMIDI(mei)
  else {
          //testSoundfont()
          playMeiSoundfont(mei)
  }
}

function playMeiMIDI(mei) {
  let midiDat
  try {
    midiDat = createMidiMEI(mei)
  } catch (e) {
    console.log("Failed to create midi", e)
  }
  if (midiDat) {
    MIDI.Player.loadFile(midiDat, MIDI.Player.start)
    //MIDI.Player.on('endOfFile', ()=>console.log("PLAYBACK ENDED"))
  }
}

// tempo BPM
var tempo = 70
var ctx, inst1, inst2

function playMeiSoundfont(mei) {
  let parser = new DOMParser()
  let xml = parser.parseFromString(mei, "text/xml")
  let meas = xml.getElementsByTagName("measure")

  let period = 60/tempo
  let time = ctx.currentTime + 0.1

  for (let m of meas) {
    //console.log(m)
    let noteElms = m.getElementsByTagName("layer")[0].children
    for (let n of noteElms) {
      //console.log(n)
      if (n.nodeName === "note") {
        let a = n.attributes
        console.log("NOTE", a.pnum, a.pname, a.oct, a.dur)
        // Assume coming as "16","8","4" etc fractions of semibreve
        let d = parseInt(a.dur.nodeValue, 10)
        console.log(d)
        if (d) {
          //console.log("Scheduling:", a.pnum, time, period/d)
          inst1.play(a.pnum.nodeValue, time, {duration: (period/d)})
          time += period/d
        }
      }
      if (n.nodeName === "rest") {
        let a = n.attributes
        console.log("REST", a.dur)
        let d = parseInt(a.dur.nodeValue, 10)
        // Assume coming as "16","8","4" etc fractions of semibreve
        if (d) { time += period/d }
      }
    } // for n
  } // for m
}

export function midiStart() {
  if (useMIDIjs)
    MIDI.Player.start()
  else {

  }
}

export function initMidi(dispatch) {
  if (useMIDIjs) {
  MIDI.loadPlugin({
    soundfontUrl: "http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/",
    instruments: [ "acoustic_grand_piano", "acoustic_guitar_nylon", "violin" ],
    onsuccess: ()=>{console.log("MIDI Loaded")
                    if (dispatch) dispatch({type:"MIDI_LOADED"})
                   } })
  } else {

    ctx = new AudioContext()
//    sfont = new Soundfont(ctx)
//    inst = sfont.instrument('acoustic_grand_piano')
    Soundfont.instrument(ctx, 'violin')
    .then(player => {
      inst2 = player
      return Soundfont.instrument(ctx,"acoustic_grand_piano")
    })
    .then(player => {
      inst1 = player
      console.log("MIDI loaded - using Soundfont")
      dispatch({type:"MIDI_LOADED"})
    })
  }
}

function testSoundfont() {
    //var notes = "C4 C#4 D4 D#4 E4 F4 F#4 G4 G#4 A4 A#4 B4 C5 B4 Bb4 A4 Ab4 G4 Gb4 F4 E4 Eb4 D4 Db4 C4"
    var notes = "58 60 64 66 69 55"
    var notes2 = "67 64 63 58 54 58 68 52"
    var time = ctx.currentTime + 0.1
    var time2 = time
    notes.split(" ").forEach(note=>{
      console.log("Scheduling...", note, time)
      inst1.play(note, time, {duration:0.4})
      time += 0.3
    })
    notes2.split(" ").forEach(note=>{
      console.log("Scheduling...", note, time2)
      inst2.play(note, time2, {duration:0.3})
      time2 += 0.3
    })
}
