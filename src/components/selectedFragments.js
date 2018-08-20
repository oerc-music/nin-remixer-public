import React from 'react'
import { connect } from 'react-redux'
import { BareFragList } from './fragmentList'
import { selectFragment } from './load-fragments'
import { withFragFilter } from '../actionsFrags'

const FragList = BareFragList

export var MatchSelector = function({dispatch, matchtype, matchchecked,
                                     filtSpec }) {
  //const id = matchtype
  const checked = matchchecked
  const handleChange = (id) => {dispatch(withFragFilter(
                                           {type:'TOGGLEMATCH',
                                            id: id }
                                           ))}
  const filts = Array.from(filtSpec.entries()).map(([index, ent]) =>
      <li key={ent.type+ent.target}>
      {ent.type} -> {ent.target}
      </li>
      )
  return (
         <div className="matchSel">
           Match By:
           <br/>
           <label>
             <input type="checkbox" checked={checked}
                onChange={handleChange} />
             Key Compatibility
           </label>
           <br/>
           <ul>{filts}</ul>
         </div>
         )
}
MatchSelector = connect(s=>s)(MatchSelector)

export var FragmentSelector = function({dispatch, selectedFrags,
                                        filtIsUpdating,
                                        frags, filtFrags, svg}) {
  const selectOnClick = (index, id)=> {dispatch(selectFragment(index, id))}
  console.log(frags,filtFrags)
  return (
        <div className="listcol">
          <FragList fragments={filtFrags.length?filtFrags:frags}
                    svg={svg}
                    selecting={! filtIsUpdating}
                    onClick={selectOnClick} />
        </div>
  )
}
FragmentSelector = connect(s=>s)(FragmentSelector)

//export const FragList = connect(s=>({
    //fragments: s.frags,
    //svg: s.svg
//}))(BareFragList)
