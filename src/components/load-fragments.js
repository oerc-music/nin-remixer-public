import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { getLDPcontents, getFragInfo } from '../actions/rdf'
import { withFragFilter } from '../actionsFrags'
import { extractNotesMEI, initMidi } from '../audioHandling'

// Action Creator
export function setFrags(frags) {
  return { type: 'SET_FRAGS', frags}
}

// Action Creator
export function setMei(uri, mei, svg) {
  return { type: 'SET_MEI', uri, mei, svg }
}

// Action Creator
export function selectFragment(index, id) {
  //console.log("making SELECT_FRAG:", index, id)
  return withFragFilter({ type: 'SELECT_FRAG', index, id})
}

// already loaded in page as script
const vrvTk = new window.verovio.toolkit();
const vrvOptions = { pageHeight: 400, pageWidth: 2000, scale: 25, border:0, adjustPageHeight: 1};

      // The event handler dispatches
      //  => a function (intercepted by redux-thunk)
      //  => which (when run by redux-thunk) initiates a HTTP request
      //  => and on completion of returned promise
      //  => dispatches the SET_ITEMS action with the reponse
function fragmentsPromise(dispatch) {
        axios.get('/config.json')
          .then(response => {
                dispatch({type:'SETCONFIG', config: response.data})
                //if (response.data.setconfig) {
                //  dispatch({type:'SETCONFIG', config: response.data})
                //}
                let p = getLDPcontents(response.data.workset)
                   .then(uris => {
                     return Promise.all(uris.map(getFragInfo))
                   })
                   .then(frags => {
                     console.log(frags)
                     // set the list of fragments
                     dispatch(setFrags(frags))
                     for (let f of frags) {
                        axios.get(f.mei)
                          .then(res => {
                            let svg = vrvTk.renderData(res.data, vrvOptions)
                            //console.log(svg)
                            dispatch(setMei(f.mei, res.data, svg))
                            //extractNotesMEI(res.data)
                          })
                     }
                   })
                   .then(()=> { dispatch({type:'HIDEGO'}) })
                return p
            })
}

export let LoadButton = function({dispatch, label}) {
  return (
      // An event handler
      //  => which dispatches
      //  => a function (intercepted by redux-thunk)
      <button onClick={ e=> {
              initMidi()
              dispatch(fragmentsPromise)} } >
      {label}
      </button>
     )
}
LoadButton=connect()(LoadButton)

