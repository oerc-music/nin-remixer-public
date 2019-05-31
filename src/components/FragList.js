import React from 'react'
import { connect } from 'react-redux'
import WrappedSVG from './WrappedSVG'
import { selectFragment } from './load-fragments'
import { playMei, midiStart } from '../audioHandling'

const showkey = (key, mode) => key + (mode === "minor" ? " minor" : "")

//const scalefac = 1.0

export class BareFragList extends React.Component {
   render() {
      //const dispatch = this.props.dispatch
      const selectDisabled = ! this.props.selecting;
      const onClick = this.props.onClick;
      const items = this.props.fragments;
      const svgs = this.props.svg;
      const meis = this.props.mei;
      const row = this.props.cursorRow;
      //console.log("SVGS",svgs)
      //console.log("MEIS",meis)
      const listItems = Array.from(items.entries()).map(([index, itm]) =>
            <div className="fragItem" key={itm.id}>
	            <button onClick={e=>{let m=meis.get(itm.mei);
		            playMei(m, row)
	            }}
	                    disabled={this.props.disablePlay}
	                    className="playbutton">▶</button>
	            <div style={{display:"inline"}} onClick={e=>{onClick(index, itm.id)}}>

	              <span title={itm.id}>
	              {itm.title} ({showkey(itm.keydisp, itm.mode)})
	              </span>
                  <div className="fraguri"> {itm.id} </div>
	              {(svgs.has(itm.mei)) && (
	                  //<div style={{transform:"scale("+scalefac+")"}}><WrappedSVG src={svgs.get(itm.mei)}
	                  <div><WrappedSVG src={svgs.get(itm.mei)}
	                          width={this.props.svgwidth.get(itm.mei)}/></div>
	                  )}
	            </div>
            </div>
            );

      return (
         <div className="fraglist">
             {listItems}
         </div>
         );
   }
}

//export const ConnTestList = connect(s=>s)(TestList)
//export const FTestList = connect(s=>{return {items: s.frags.map(i=>i.title)};})(TestList)

//export const FragList = connect(s=>({
//    fragments: s.filtFrags,
//    svg: s.svg
//  }),dispatch=> ({
//    onClick: (index, id)=> {dispatch(selectFragment(index, id))}
//}) )(BareFragList)
