import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

function goReindex(dispatch, workset, reindexService) {
    // ignore proper encoding for now
    var loc = reindexService + '?' + workset
    var start = Date.now()
    axios.get(loc)
      .then(r => {
          var end = Date.now()
          dispatch({type: 'REINDEXING', val: false})
          dispatch({type: 'REINDEX_DONE', time: (end-start)/1000})
          setTimeout(()=>dispatch({type: 'REINDEX_FINISH_DONE'}), 7500)
      })
}

export let ReIndexButton = function({dispatch, workset, reindexService}) {
    return (
	    <button className='reindexBtn' onClick= {e => {
                dispatch({type:'REINDEXING', val: true})
                goReindex(dispatch, workset, reindexService)
	       } }>
	    Update Annotations
	    </button>
    )
}
ReIndexButton = connect(s=>s)(ReIndexButton)

