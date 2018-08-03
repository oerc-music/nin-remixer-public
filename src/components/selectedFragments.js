import React from 'react'
import { connect } from 'react-redux'
import { BareFragList } from './fragmentList'
import { selectFragment } from './load-fragments'

const FragList = BareFragList

const updateMatch = function(dispatch, id) {
  dispatch({type:'TOGGLEMATCH', id: id})
  //var p = 
}

export var MatchSelector = function({dispatch, matchtype, matchchecked}) {
  const id = matchtype
  const checked = matchchecked
  const handleChange = (id) => {dispatch({type:'TOGGLEMATCH',
                                  id: id })}
  return (
         <div className="matchSel">
           Match By:
           <br/>
           <label>
             <input type="checkbox" checked={checked}
                onChange={handleChange} />
             Key Compatibility
           </label>
         </div>
         )
}
MatchSelector = connect(s=>s)(MatchSelector)

export var FragmentSelector = function({dispatch, selectedFrags,
                                        frags, filtFrags, svg}) {
  const selectOnClick = (index, id)=> {dispatch(selectFragment(index, id))}
  console.log(frags,filtFrags)
  return (
        <div className="listcol">
          <FragList fragments={filtFrags.length?filtFrags:frags}
                    svg={svg}
                    onClick={selectOnClick} />
        </div>
  )
}
FragmentSelector = connect(s=>s)(FragmentSelector)

//export const FragList = connect(s=>({
    //fragments: s.frags,
    //svg: s.svg
//}))(BareFragList)
