import React from 'react'
import { connect } from 'react-redux'
import { instrumentLabel } from '../uriInfo'
import { loadInstrument } from '../audioHandling'
import _ from 'lodash'

function InstrumentOption({uri}) {
  return <option value={uri}>{instrumentLabel(uri)}</option>
}

            //{// if no instruments}
            // return <optgroup label="Hello" />
class InstrumentSelector extends React.Component {
  render() {
   let services = this.props.services

   return <select ref="selbox" onChange={this.props.onchange(this.props.ind)}
           onBlur={this.props.onblur} >
            { services && services.length ? <option value="">-- Choose an instrument --</option>
                       : <option value="">No instruments loaded yet</option>
            }
            { services && _.range(services.length).map(i=> (
                 <InstrumentOption uri={services[i]} />
                 ))
            }
          </select>
  }

  componentDidMount() {
    this.refs.selbox.focus()
  }
}

function mapDispatchToProps(dispatch) {
  return {
     test: e=>{dispatch((d,gs)=>{console.log("TEST",gs());return true})},
     onchange: (i)=>e=>{
             loadInstrument(e.target.value, i)
               .then(dispatch({type: "MIDI_LOADED"}))
             dispatch({type:"ROW_SET",
                       ind:i, uri:e.target.value}) },
     onblur: e=>{dispatch({type:"ROW_EDITING", val: -1})}
  }
}

export default connect(s=>({services:s.availInstrServices}),
                       mapDispatchToProps) (InstrumentSelector)
