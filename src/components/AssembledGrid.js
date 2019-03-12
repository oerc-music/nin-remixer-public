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

export var AssembledGrid = function({dispatch, rowURIs, addRow, delRow, rowBeingEdited, editInstrument, selectedFrags, cursorRow, cursorCol, frags, svg, svgwidth, selCell, filtIsUpdating, clearCell}) {
  const cols = Math.max(_.max(_.map(selectedFrags, (x=>x.length)))+1, cursorCol+1)

  function mkGridCell(width, src, sel, row, col) {
    return <div> {sel?<button onClick={e=>clearCell(row, col)} className="overlayBtn">X</button>:null} <WrappedSVG width={width} src={src} /> </div>
  }

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
                  <button onClick={e=>{e.stopPropagation();delRow(rowInd)}}>x</button>
                  {mkInstLabel(rowURIs[rowInd], parseInt(rowInd))}
                </td>
          }
          { 
             _.range(cols).map((i=>{
               const cell = row[i]
               const frag = cell ? frags.find(f => f.id === cell.id) : null;
               let cursorClass = []
               let selected = false
               if (Number(rowInd)===cursorRow && i===cursorCol) {
                  selected = true
                  cursorClass.push("selCell")
                  if (filtIsUpdating) cursorClass.push("filtUpdating")
               }
               const fsvg = frag ?
                              mkGridCell(svgwidth.get(frag.mei), svg.get(frag.mei), selected, cursorRow, cursorCol)
                              : null
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
    <button onClick={e=>{addRow()}} className="instAdd">➕ Instrument</button>
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
                          },
                          clearCell: (row, col) => {
                              dispatch(withFragFilter(
                                       {type: "CLEAR_CELL",
                                         row: row,
                                         col, col}))
                          },
                          addRow: () => {
                              dispatch({type: "ROW_ADD"})
                          },
                          delRow: (row) => {
                              dispatch({type: "ROW_DEL",
                                        ind: row})
                          }

                          }) 
                )(AssembledGrid)

