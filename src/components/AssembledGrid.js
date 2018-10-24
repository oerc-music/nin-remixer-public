import React from 'react'
import { connect } from 'react-redux'
import { selectFragment } from './load-fragments'
import { withFragFilter } from '../actionsFrags'
import InstrumentSelector from './InstrumentSelector'
import WrappedSVG from './WrappedSVG'
import { instrumentLabel } from '../uriInfo'
import InlineSVG from 'svg-inline-react'
import _ from 'lodash'

function mkInstLabel(uri, row) {
  let l = instrumentLabel(uri)
  if (l) {
    return l
  } else {
    return <i>Instrument {(row+1)} </i>
  }
}

export var AssembledGrid = function({dispatch, rowURIs, rowBeingEdited, editInstrument, selectedFrags, cursorRow, cursorCol, frags, svg, svgwidth, selCell, filtIsUpdating}) {
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
          { (rowInd === rowBeingEdited)
             ?  <td className="instName">
                  <InstrumentSelector ind={rowInd} />
                </td>
             :  <td onClick={editInstrument(rowInd)} className="instName">
                  {mkInstLabel(rowURIs[rowInd], parseInt(rowInd))}
                </td>
          }
          { 
             _.range(cols).map((i=>{
               const cell = row[i]
               const frag = cell ? frags.find(f => f.id === cell.id) : null;
               const fsvg = frag ? <WrappedSVG width={svgwidth.get(frag.mei)} src={svg.get(frag.mei)} /> : null
               let cursorClass = []
               if (Number(rowInd)===cursorRow && i===cursorCol) {
                  cursorClass.push("selCell")
                  if (filtIsUpdating) cursorClass.push("filtUpdating")
               }
               return (
                 <td key={rowInd+"-"+i}
                   className={cursorClass.join(' ')} onClick={e=>{selCell(Number(rowInd), i)}} >
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
                          },
                          editInstrument: (row) => e => {
                              dispatch({type: "ROW_EDITING",
                                        val: row})
                          }
                          }) 
                )(AssembledGrid)

