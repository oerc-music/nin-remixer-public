import React from 'react'
import { connect } from 'react-redux'
import { selectFragment } from './load-fragments'
import { withFragFilter } from '../actionsFrags'
import InlineSVG from 'svg-inline-react'
import _ from 'lodash'

export var AssembledGrid = function({dispatch, rowNames, selectedFrags, cursorRow, cursorCol, frags, svg, selCell}) {
  const cols = Math.max(_.max(_.map(selectedFrags, (x=>x.length)))+1, cursorCol+1)
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
                 <td key={rowInd+"-"+i}
                   className={Number(rowInd)===cursorRow && i===cursorCol ? "selCell":null} onClick={e=>{selCell(Number(rowInd), i)}} >
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
AssembledGrid = connect(s=>s,
                  dispatch=>({
                          selCell: (row, col) => {
                              //focus cursor on cell
                              dispatch(withFragFilter(
                                       {type:"SET_CURSOR",
                                        row: row,
                                        col: col}))
                          }
                          }) 
                )(AssembledGrid)

