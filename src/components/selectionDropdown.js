import React from 'react'
import { connect } from 'react-redux'
import { BareFragList } from './fragmentList'
import { selectFragment } from './load-fragments'

const FragList = BareFragList

export var SelectionDropdown = function({dispatch, selectedFrags, frags, svg}) {
  const selectOnClick = (index, id)=> {dispatch(selectFragment(index, id))}
	const triggerSelectionDropdown = () => { 
		fragSelectionList.current.classList.toggle("hidden"); 
		if(expandIndicator.current.innerHTML === "+") { 
			expandIndicator.current.innerHTML = "-";
		} else { 
			expandIndicator.current.innerHTML = "+";
		}
	}
	let fragSelectionList = React.createRef();
	let expandIndicator = React.createRef();
  return (
      <div>
        { 
          [...selectedFrags.entries()].map(([ind,item])=>{
            //<p> Selection (flist.id) </p>

            return (
            <div className="selectionDropdownWrapper" key={ind}>
							<div className="selectionLabel" onClick={ triggerSelectionDropdown}> 
								<span className="expandIndicator expanded" ref={expandIndicator}>-</span> <span>Make a selection</span>
							</div>
							<div className="fragSelectionList" ref={fragSelectionList}>
								<FragList fragments={frags}
													svg={svg}
													onClick={selectOnClick} />
							</div>
							<hr/>
            </div>
            )
          })}
      </div>
    )
}

SelectionDropdown = connect(s=>s)(SelectionDropdown)

//export const FragList = connect(s=>({
    //fragments: s.frags,
    //svg: s.svg
//}))(BareFragList)
							//<div onClick={ () => { fragSelectionList.classList.toggle(".hidden") }}> Make a selection </div>
