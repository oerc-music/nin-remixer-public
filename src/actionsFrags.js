import axios from 'axios'
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
      if (s.selectedFrags[s.cursorRow][s.cursorCol-1])
      filt = [{type: s.matchtype,
               target: s.selectedFrags[s.cursorRow][s.cursorCol-1]
              }]
    }
    // sort and uniq filters to canonical form
    filt = _(filt).sortBy(['type', 'target'])
            .uniqWith((x,y)=> x.type == y.type && x.target==y.target)
            .value()
    // compare to existing filter
    if (! _.isEqual(filt, s.filtSpec)) {
      // 
      dispatch({type: 'FILT_UPDATING', val: true})
      filterFragments(s.frags, filt)
        .then(fs => {
          dispatch({type: 'FILT_SETFRAGS',
                    frags: fs,
                    spec: filt })
          dispatch({type: 'FILT_UPDATING', val: false})
          })
    }
  }
}

function filterFragments(frags) {
  return Promise.resolve(_.take(frags, 8))
}

