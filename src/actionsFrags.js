import axios from 'axios'
import { findMatchService, findAnnotationMatches, idlog }
    from './matchservice-utils'
import _ from 'lodash'

// wrap an action to a thunk which dispatches
// then checks whether frag filter needs updating

export function withFragFilter(action) {
  return function (dispatch, getState) {
    dispatch(action)
    let s = getState()
    let filt = []
    // work out needed filters
    if (s.matchType) {
      if (s.selectedFrags[s.cursorRow][s.cursorCol-1]
          && s.selectedFrags[s.cursorRow][s.cursorCol-1].id)
        filt.push({type: s.matchType,
               target: s.selectedFrags[s.cursorRow][s.cursorCol-1].id
                 })
      if (s.selectedFrags[s.cursorRow][s.cursorCol+1]
          && s.selectedFrags[s.cursorRow][s.cursorCol+1].id)
        filt.push({type: s.matchType,
               target: s.selectedFrags[s.cursorRow][s.cursorCol+1].id
        })
    }
    // sort and uniq filters to canonical form
    filt = _(filt).sortBy(['type', 'target'])
            .uniqWith((x,y)=> x.type == y.type && x.target==y.target)
            .value()
    // compare to existing filter
    if (! _.isEqual(filt, s.filtSpec)) {
      // 
      dispatch({type: 'FILT_UPDATING', val: true})
      filterFragments(getState().frags, filt,
                      getState().wsi, getState().workset)
        .then(fs => {
          dispatch({type: 'FILT_SETFRAGS',
                    frags: fs,
                    spec: filt })
          dispatch({type: 'FILT_UPDATING', val: false})
          })
    }
  }
}

function filterFragments(frags, filtspec, wsi, wset) {
  let mtype, targ
  console.log("filtspec:",filtspec)
  if (filtspec.length) {
    mtype = filtspec[0].type
    targ = filtspec[0].target
  }
  let p = findMatchService(wsi, mtype, wset)
    .then(mservice => findAnnotationMatches(mservice, targ))
    .then(idlog)
    .then(fragids => frags.filter(f=>fragids.includes(f.id)))
    .then(idlog)
    .catch(e => {console.log(e);return Promise.resolve(_.take(frags, 8))})
  return p
  //return Promise.resolve(_.take(frags, 8))
        // .then(x=> new Promise(r=>setTimeout(()=>r(x),100)))
}

