import React from 'react'
import { connect } from 'react-redux'
import WrappedSVG from './WrappedSVG'
import { selectFragment } from './load-fragments'
import { playMei, midiStart } from '../audioHandling'

const showkey = (key, mode) => key + (mode === "minor" ? " minor" : "")

export class BareFragList extends React.Component {
   render() {
      //const dispatch = this.props.dispatch
      const selectDisabled = ! this.props.selecting
      const onClick = this.props.onClick
      const items = this.props.fragments
      const svgs = this.props.svg
      const meis = this.props.mei
      //console.log("SVGS",svgs)
      //console.log("MEIS",meis)
      const listItems = Array.from(items.entries()).map(([index, itm]) =>
            <li key={itm.id}>
              <div title={itm.id}>
              {itm.title} ({showkey(itm.keydisp, itm.mode)})
              </div>
              {(svgs.has(itm.mei)) && (
                  <div><WrappedSVG src={svgs.get(itm.mei)}
                          width={this.props.svgwidth.get(itm.mei)}/></div>
                  )}
              <button onClick={e=>{onClick(index, itm.id)}}
                      disabled={selectDisabled}>
                Select
              </button>
              <button onClick={e=>{let m=meis.get(itm.mei)
                                   playMei(m)
                                   }}
                      disabled={this.props.disablePlay}
                      className="playbutton">▶</button>
            </li>
            );

      return (
         <div className="fraglist">
           <ul>
             {listItems}
           </ul>
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
