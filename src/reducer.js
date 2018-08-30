import update from 'immutability-helper'


const KEYMATCH="http://remix.numbersintonotes.net/vocab#keyCompatibility"
const LENGTHMATCH="http://remix.numbersintonotes.net/vocab#lengthCompatibility"
const INSTMATCH="http://remix.numbersintonotes.net/vocab#instrumentCompatibility"


var emptyState = {
                    frags:[],
                    mei:new Map(),
                    svg:new Map(),
                    hideGo: false,

                    // filtUpdating contains a tag if update in progess
                    filtIsUpdating: false,
                    // filtSpec: [{type:MATCH-TYPE-URI,target:TARGET-URI}]
                    filtSpec: [],
                    //?filtNewSpec: null,
                    // filtFrags - selected fragments
                    filtFrags: [],

                    matchType: KEYMATCH,
                    matchchecked: true,

                    cursorRow: 0,
                    cursorCol: 0,
                    rowNames: ["Instrument1", "Instrument2", "Instrument3"],
                    selectedFrags: [
				    [],
				    [],
				    []
                                   ],

                    wsi: null,
                    workset: null
                  }

// Helper to set a state entry from a config object
function setState(state, config, name) {
      if (name in config) {
        return update(state, {[name]: {$set: config[name]}})
      }
      return state
}

export function ninReducer(state = emptyState, action) {
  switch (action.type) {
    case 'SET_FRAGS':
      for (let f of action.frags) {
        f.keydisp = f.key.replace('b','♭')
      }
      return update (state, {frags: {$set: action.frags}})
    case 'SET_MEI':
      //console.log(state)
      return update(state, {mei: {$add: [[action.uri, action.mei]]},
                            svg: {$add: [[action.uri, action.svg]]} })
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
    case 'SETCONFIG':
      var nstate = state
      nstate = setState(nstate, action.config, "wsi")
      nstate = setState(nstate, action.config, "workset")
      nstate = setState(nstate, action.config, "rowNames")
      nstate = setState(nstate, action.config, "selectedFragments")
      nstate = setState(nstate, action.config, "cursorRow")
      nstate = setState(nstate, action.config, "cursorCol")
      return nstate
    case 'HIDEGO':
      return update (state, {hideGo: {$set: true}})
    case 'TOGGLEMATCH':
      return update(state, {matchchecked: (x=>!x),
                            filtFrags: {$set: []}})
    case 'FILT_UPDATING':
      return update(state, {filtIsUpdating: {$set: action.val}})
    case 'FILT_SETFRAGS':
      return update(state, {filtSpec: {$set: action.spec},
                            filtFrags: {$set: action.frags}})
    default:
      return state
  }
}
