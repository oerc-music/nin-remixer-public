import MIDI from 'midi.js'
import Soundfont from 'soundfont-player'
import { getSoundfont } from './uriInfo'
import _ from 'lodash'

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

export function playMei(mei, iind) {
  if (useMIDIjs)
          playMeiMIDI(mei)
  else {
          //testSoundfont()
          playMeiSoundfont(mei, iind)
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
var instruments = []
const defSoundfont = 'MusyngKite/bright_acoustic_piano-mp3.js'

function playMeiSoundfont(mei, iindex) {
  let parser = new DOMParser()
  let xml = parser.parseFromString(mei, "text/xml")
  let meas = xml.getElementsByTagName("measure")

  let period = 60/tempo
  let time = ctx.currentTime + 0.1
  const instr = instruments[iindex]
  if (!instr) { return }

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
          instr.play(a.pnum.nodeValue, time, {duration: (period/d)})
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

export function playMeiGrid(meiMap, fragGrid, fragments) {
  let period = 60/tempo
  let starttime = ctx.currentTime + 0.1
  let nrows = fragGrid.length
  let ncols = _.max(_.map(fragGrid,x=>x.length))

  let fragmap = new Map(_.map(fragments, x=>([x.id, x.mei])))
  //console.log(fragGrid, nrows, ncols)
  console.log(meiMap)

  for (let c in _.range(ncols)) {
    let coltime = starttime
    for (let r in _.range(nrows)) {
      let frag = fragGrid[r][c]
      let mei
      if (frag && frag.id) { mei = meiMap.get(fragmap.get(frag.id)) }
      if (! mei) {console.log(frag, mei); continue}
      let parser = new DOMParser()
      let xml = parser.parseFromString(mei, "text/xml")
      let meas = xml.getElementsByTagName("measure")
    
      let time = starttime
      const instr = instruments[r]
      //if (!instr) { return }
    
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
              instr.play(a.pnum.nodeValue, time, {duration: (period/d)})
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
      coltime = Math.max(coltime, time)
    }
    starttime = coltime
  }
}

export function midiStart() {
  if (useMIDIjs)
    MIDI.Player.start()
  else {

  }
}

export function loadInstrument(instr, index) {
   let instLoc = getSoundfont(instr)
   if (!instLoc) instLoc = defSoundfont
   return Soundfont.instrument(ctx, instLoc)
            .then(player => {
                    console.log("Loaded ", instLoc, instr)
                    instruments[index] = player })

}

export function initMidi(dispatch, uris) {
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
    Promise.all(_.range(uris.length).map(i=>{
       let instLoc = getSoundfont(uris[i])
       if (!instLoc) instLoc = defSoundfont
       return Soundfont.instrument(ctx, instLoc)
                .then(player=>{
                        console.log("Loaded ", instLoc, uris[i])
                        instruments[i] = player })
       })
    //Soundfont.instrument(ctx, 'violin')
    //.then(player => {
      //inst2 = player
      //return Soundfont.instrument(ctx,"acoustic_grand_piano")
                      //"/FluidR3_GM/trumpet-mp3.js""MusyngKite/electric_piano_1-mp3.js")
      //return Soundfont.instrument(ctx, "MusyngKite/banjo-mp3.js")
    )
    .then(() => {
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
