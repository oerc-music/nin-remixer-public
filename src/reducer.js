import update from 'immutability-helper'

const KEYMATCH="http://remix.numbersintonotes.net/vocab#keyCompatibility"
const LENGTHMATCH="http://remix.numbersintonotes.net/vocab#lengthCompatibility"
const INSTMATCH="http://remix.numbersintonotes.net/vocab#instrumentCompatibility"
//function appReducer(s = {items:["Foo", "Boo", "Baz"]} ,a) {
//  return s
//}
var emptyState = {
                    frags:[],
                    mei:new Map(),
                    svg:new Map(),
                    hideGo: false,

                    filtFrags:[],

                    matchType: KEYMATCH,
                    matchchecked: true,

                    cursorRow: 0,
                    cursorCol: 0,
                    rowNames: ["Instrument1", "Instrument2", "Instrument3"],
                    selectedFrags: [
				    [null],
				    [null],
				    [null]
                                   ]
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
        if (nrow==0) { //move to next col
          newstate = update(newstate, { cursorCol: (c=>c+1) })
        }
        newstate = update(newstate, {filtFrags: {$set: []}})
      return newstate
    case 'SETCONFIG':
      //console.log(action);
      var nstate = state
      if ('rowNames' in action.config) {
        nstate = update(nstate, {rowNames: {$set: action.config.rowNames}})
      }
      if ('selectedFrags' in action.config) { 
        nstate = update(nstate, {selectedFrags: {$set: action.config.selectedFrags}})
      }
      if ('cursorRow' in action.config) {
        nstate = update(nstate, {cursorRow: {$set: action.config.cursorRow}})
      }
      if ('cursorCol' in action.config) {
        nstate = update(nstate, {cursorCol: {$set: action.config.cursorCol}})
      }
      return nstate
    case 'HIDEGO':
      return update (state, {hideGo: {$set: true}})
    case 'TOGGLEMATCH':
      return update(state, {matchchecked: (x=>!x),
                            filtFrags: {$set: []}})
    default:
      return state
  }
}
