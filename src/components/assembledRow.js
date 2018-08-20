import React from 'react'
import { connect } from 'react-redux'
import { selectFragment } from './load-fragments'
import InlineSVG from 'svg-inline-react'
import _ from 'lodash'

export var AssembledGrid = function({dispatch, rowNames, selectedFrags, cursorRow, cursorCol, frags, svg}) {
  const cols = Math.max(_.max(_.map(selectedFrags, (x=>x.length))), cursorCol+1)
  //console.log(cols, cursorCol)
  return ( 
    <div className="assembledGrid">
    <table>
    <tbody>
    { Object.keys(selectedFrags).map( (rowInd) => {
      const row = selectedFrags[rowInd]
      return (
        <tr key={rowInd}>
          <td className="instName"> {rowNames[rowInd]} </td>
          { 
             _.range(cols).map((i=>{
               const cell = row[i]
               const frag = cell ? frags.find(f => f.id === cell.id) : null;
               const fsvg = frag ? <InlineSVG src={svg.get(frag.mei)} /> : null
               return (
                 <td key={rowInd.toString()+"-"+i}
                   className={rowInd===cursorRow && i===cursorCol ? "selCell":null}>
                 {fsvg}
                 </td>
                 )
             })
            )
          }
        </tr>
        )
     }) }
    </tbody>
    </table>
    </div>
  )
}
AssembledGrid = connect(s=>s)(AssembledGrid)

