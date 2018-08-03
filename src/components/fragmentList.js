import React from 'react'
import { connect } from 'react-redux'
import InlineSVG from 'svg-inline-react'
import { selectFragment } from './load-fragments'

const showkey = (key, mode) => key + (mode === "minor" ? " minor" : "")

export class BareFragList extends React.Component {
   render() {
      //const dispatch = this.props.dispatch
      const onClick = this.props.onClick
      const items = this.props.fragments
      const svgs = this.props.svg
      const listItems = Array.from(items.entries()).map(([index, itm]) =>
            <li key={itm.id}>
              <div title={itm.id}>
              {itm.title} ({showkey(itm.keydisp, itm.mode)})
              </div>
              {(svgs.has(itm.mei)) && (
                  <div><InlineSVG src={svgs.get(itm.mei)}/></div>
                  )}
              <button onClick={e=>{onClick(index, itm.id)}}>
                Select
              </button>
              <button className="playbutton">▶</button>
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
export const FragList = connect(s=>({
    fragments: s.filtFrags,
    svg: s.svg
  }),dispatch=> ({
    onClick: (index, id)=> {dispatch(selectFragment(index, id))}
}) )(BareFragList)
