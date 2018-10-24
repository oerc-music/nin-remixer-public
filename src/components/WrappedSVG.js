import React from 'react'
import { connect } from 'react-redux'
import InlineSVG from 'svg-inline-react'


export default function WrappedSVG({src, width}) {
  return (<div style={{width: width+'px', 'overflow-x': 'hidden'}}>
             <InlineSVG src={src} />
          </div>)
}
