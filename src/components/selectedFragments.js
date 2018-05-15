import React from 'react'
import { connect } from 'react-redux'
import { BareFragList } from './fragmentList'
import { selectFragment } from './load-fragments'

const FragList = BareFragList

export var FragmentSelector = function({dispatch, selectedFrags, frags, svg}) {
  const selectOnClick = (index, id)=> {dispatch(selectFragment(index, id))}
  return (
      <div>
        { 
          [...selectedFrags.entries()].map(([ind,item])=>{
            //<p> Selection (flist.id) </p>

            return (
            <div className="listcol">
							<p> Selection </p>
							<FragList fragments={frags}
												svg={svg}
												onClick={selectOnClick} />
							<hr/>
            </div>
            )
          })}
      </div>
    )
}
FragmentSelector = connect(s=>s)(FragmentSelector)

//export const FragList = connect(s=>({
    //fragments: s.frags,
    //svg: s.svg
//}))(BareFragList)
