import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { getLDPcontents, getFragInfo } from '../actionsRdf'
import { withFragFilter } from '../actionsFrags'
import { extractNotesMEI, initMidi } from '../audioHandling'
import { getAvailInstruments } from '../matchservice-utils'

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
const vrvOptions = { pageHeight: 400, pageWidth: 2500, scale: 25, border:0, adjustPageHeight: 1};

function getSvgBounds(svg) {
  let res
  try {
    let d = document.getElementById("svgtest")
    d.innerHTML=svg
    res = d.firstElementChild.getBBox()
  } catch (e) { console.log(e) }
  return res
}

      //  Returns a function which the event handler dispatches
      //  => a function (intercepted by redux-thunk)
      //  => which (when run by redux-thunk) initiates a HTTP request
      //  => and on completion of returned promise
      //  => dispatches the SET_ITEMS action with the reponse
function mkFragmentsPromise(workset) {
        return (dispatch => {
                //console.log("FRAGDISP", dispatch)
                let p = getLDPcontents(workset)
                   .then(uris => {
                     return Promise.all(uris.map(i=>getFragInfo(i).catch(e=>e)))
                   })
                   .then(frags => {
                     //console.log("LOGFRAGS",frags)
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

export function loadConfig(dispatch) {
        axios.get('/config.json')
          .then(response => {
                dispatch({type:'SETCONFIG', config: response.data})
          })
}

function loadInstruments(dispatch, wsi, workset) {
  getAvailInstruments(wsi, workset)
    .then(inst => dispatch({type:'SET_INSTRUMENTS', instruments: inst}))
}

export let LoadButton = function({dispatch, label, wsi, workset, rowURIs}) {
  return (
      // An event handler
      //  => which dispatches
      //  => a function (intercepted by redux-thunk)
      <button onClick={ e=> {
              loadInstruments(dispatch, wsi, workset)
              initMidi(dispatch, rowURIs)
              dispatch(mkFragmentsPromise(workset))} } >
      {label}
      </button>
     )
}
LoadButton=connect(s=>s)(LoadButton)

