import React from 'react'
import { connect } from 'react-redux'
import { BareFragList } from './fragmentList'
import { selectFragment } from './load-fragments'
import InlineSVG from 'svg-inline-react'

const FragList = BareFragList

// Actually this a selected grid as shows all rows
export var AssembledRow = function({dispatch, selectedFrags, frags, svg}) {
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
	if(selectedFrags) { 
	  return Object.keys(selectedFrags).map( (rowIndex) => {
		  return (
			  <div className="assembledRow">
				{ 
				  [...selectedFrags[rowIndex].entries()].map(([ind,item])=>{
					//<p> Selection (flist.id) </p>
					if(item) { 
						const frag = frags.find(f => f.id === item.id);
						const fsvg = frag===undefined ? <InlineSVG /> : <InlineSVG src={svg.get(frag.mei)} />
						return(<div> {fsvg} </div>)
					} else { 
						console.log("WARNING - undefined item");
						return (<div/>)}
				  })}
			  </div>
			)
	  })
	} else { return <div>Awaiting selection</div> }
}

AssembledRow = connect(s=>s)(AssembledRow)

//export const FragList = connect(s=>({
    //fragments: s.frags,
    //svg: s.svg
//}))(BareFragList)
							//<div onClick={ () => { fragSelectionList.classList.toggle(".hidden") }}> Make a selection </div>
