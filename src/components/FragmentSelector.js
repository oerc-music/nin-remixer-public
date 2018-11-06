import React from 'react'
import { connect } from 'react-redux'
import { BareFragList } from './FragList'
import { selectFragment } from './load-fragments'
import { withFragFilter } from '../actionsFrags'

const FragList = BareFragList

export var MatchSelector = function({dispatch, matchtype, matchchecked,
                                     filtSpec, frags, filtFrags }) {
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
           <label>
             <input type="checkbox" checked={false} disabled/>
             Matching Length
           </label>
           <label>
             <input type="checkbox" checked={false} disabled/>
             Instrument Match
           </label>
           <span style={{marginLeft:"20px"}}>( {filtFrags.length} / {frags.length} )</span>
           <br/>
           <div className="debugInfo">
             <div className="countPanel">{filtFrags.length} / {frags.length}</div>
             <div><ul>{filts}</ul></div>
           </div>
         </div>
         )
}
MatchSelector = connect(s=>s)(MatchSelector)

export var FragmentSelector = function({dispatch, selectedFrags, cursorRow,
                                        filtIsUpdating, midiLoaded, frags,
                                        filtFrags, svg, svgwidth, mei}) {
  const selectOnClick = (index, id)=> {dispatch(selectFragment(index, id))}
  //console.log(frags,filtFrags)
        //<FragList fragments={filtFrags.length?filtFrags:frags}
  filtFrags.length || (filtFrags = frags)
  return (
        <div className="nlistcol">
          { ! filtFrags && <div>"No Fragments"</div> }
          <FragList fragments={filtFrags}
                    svg={svg}
                    svgwidth={svgwidth}
                    mei={mei}
                    selecting={! filtIsUpdating}
                    disablePlay={! midiLoaded}
                    onClick={selectOnClick}
                    cursorRow={cursorRow} />
        </div>
  )
}
FragmentSelector = connect(s=>s)(FragmentSelector)

//export const FragList = connect(s=>({
    //fragments: s.frags,
    //svg: s.svg
//}))(BareFragList)
