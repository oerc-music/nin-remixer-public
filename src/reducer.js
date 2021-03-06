import update from 'immutability-helper'


const KEYMATCH="http://remix.numbersintonotes.net/vocab#keyCompatibility"
const LENGTHMATCH="http://remix.numbersintonotes.net/vocab#lengthCompatibility"
const INSTMATCH="http://remix.numbersintonotes.net/vocab#instrumentCompatibility"


var emptyState = {
                    frags:[],
                    mei:new Map(),
                    svg:new Map(),
                    svgwidth:new Map(),

                    hideGo: false,
                    fragsLoaded: false,

                    // filtUpdating contains a tag if update in progess
                    filtIsUpdating: false,
                    // filtSpec: [{type:MATCH-TYPE-URI,target:TARGET-URI}]
                    filtSpec: [],
                    //?filtNewSpec: null,
                    // filtFrags - selected fragments
                    filtFrags: [],

                    matchType: KEYMATCH,
                    matchchecked: true,
                    midiLoaded: false,
                    availInstrServices: [],

                    cursorRow: -1,
                    cursorCol: 0,
                    rowBeingEdited: -1,
                    //rowNames: ["Instrument1", "Instrument2", "Instrument3"],
                    rowURIs: [null, null, null],
                    selectedFrags: [
				    [],
				    [],
				    []
                                   ],

                    wsi: null,
                    workset: null,

	                reindexing: false,
                    reindexDone: 0,
	                reindexService: ""
                  }

// Helper to set a state entry from a config object
function setState(state, config, name) {
      if (name in config) {
        return update(state, {[name]: {$set: config[name]}})
      }
      return state
}

function svgbbox(svg){
  let r
  try {
    let d = document.getElementById("svgtest")
    d.innerHTML=svg
    r = d.firstElementChild.getBBox()
  } catch (e) { console.log(e) }
  return r
}

export function ninReducer(state = emptyState, action) {
  switch (action.type) {
    case 'SET_FRAGS':
      for (let f of action.frags) {
        f.keydisp = f.key.replace('b','♭')
      }
      var nstate = update(state, {fragsLoaded: {$set: true},
                               cursorRow: {$apply: (v)=>(v==-1?0:v)}})
      return update (nstate, {frags: {$set: action.frags}, filtFrags: {$set: action.frags}})
    case 'SET_MEI':
      let bbox = svgbbox(action.svg)
      //console.log("SVGBBOX:", bbox)
      var nstate = update(state, {mei: {$add: [[action.uri, action.mei]]},
                            svg: {$add: [[action.uri, action.svg]]} })
      if (bbox) nstate = update(nstate, {svgwidth: {$add: [[action.uri, bbox.width]]}})
      return nstate
    case 'SELECT_FRAG':
      // Set the id of current fragment
      var newstate = update(state, {
		  selectedFrags: { [state.cursorRow]: 
                                   { [state.cursorCol]: 
                                     { $set: { id: action.id} } } }
	  })
        const nrow = (state.cursorRow + 1) % (state.selectedFrags.length)
        newstate = update(newstate, { cursorRow: {$set: nrow}})
        if (nrow===0) { //move to next col
          newstate = update(newstate, { cursorCol: (c=>c+1) })
        }
        newstate = update(newstate, {filtFrags: {$set: []}})
      return newstate
    case 'ROW_EDITING':
      return update(state, {rowBeingEdited: {$set: action.val}})
    case 'ROW_SET':
      var nstate = update(state, {rowBeingEdited: {$set: -1}})
      nstate = update(nstate, {rowURIs: {$splice: [[action.ind,1,action.uri]]}})
      return nstate
    case 'ROW_ADD':
      return update(state, {selectedFrags: {$push: [[]]}})
    case 'ROW_DEL':
      var nstate = update(state, {selectedFrags: {$splice:[[action.ind,1]]},
                                  rowURIs: {$splice:[[action.ind,1]]},
                                  rowBeingEdited: {$set: -1}})
      return nstate
    case 'SETCONFIG':
      var nstate = state
      nstate = setState(nstate, action.config, "wsi")
      nstate = setState(nstate, action.config, "workset")
      //nstate = setState(nstate, action.config, "rowNames")
      nstate = setState(nstate, action.config, "rowURIs")
      nstate = setState(nstate, action.config, "selectedFragments")
      nstate = setState(nstate, action.config, "cursorRow")
      nstate = setState(nstate, action.config, "cursorCol")
      nstate = setState(nstate, action.config, "reindexService")
      return nstate
    case 'SET_INSTRUMENTS':
      return update(state, {availInstrServices: {$set: action.instruments}})
    case 'UPDATE_WORKSET':
      return update(state, {workset: {$set: action.val}})
    case 'SET_CURSOR':
      return update(state, {cursorRow: {$set: action.row},
                            cursorCol: {$set: action.col} })
    case 'CLEAR_CELL':
      return update(state, {
		  selectedFrags: { [state.cursorRow]: 
                                   { [state.cursorCol]: 
                                     { $set: undefined } } }
	  })
    case 'HIDEGO':
      return update (state, {hideGo: {$set: true}})
    case 'TOGGLEMATCH':
      return update(state, {matchchecked: (x=>!x),
                            filtFrags: {$set: []}})
    case 'MIDI_LOADED':
      return update(state, {midiLoaded: {$set: true}})
    case 'MIDI_LOADING':
      return update(state, {midiLoaded: {$set: false}})
    case 'FILT_UPDATING':
      return update(state, {filtIsUpdating: {$set: action.val}})
    case 'FILT_SETFRAGS':
      return update(state, {filtSpec: {$set: action.spec},
                            filtFrags: {$set: action.frags}})
    case 'REINDEXING':
      return update(state, {reindexing: {$set: action.val}})
    case 'REINDEX_DONE':
      return update(state, {reindexDone: {$set: action.time}})
    case 'REINDEX_FINISH_DONE':
      return update(state, {reindexDone: {$set: 0}})
    default:
      return state
  }
}
