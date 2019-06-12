import React, { Component } from 'react'
import { connect } from 'react-redux'
import './App.css'

import { LoadButton, loadConfig } from './components/load-fragments'
import { FragList } from './components/FragList'
import { FragmentSelector, MatchSelector } from './components/FragmentSelector'
import { AssembledGrid } from './components/AssembledGrid'
import { playMeiGrid } from  './audioHandling'
import { goTest } from './miditest'

import { ReIndexButton } from './components/ReIndex'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">S.O.F.A. remixer</h1>
        </header>
        {this.props.hideGo ?
		<div className="ws-details">
		  workset: <i>{this.props.workset}</i>
          <span className="reindex_stat">
          {this.props.reindexDone
              ? <label className="reind_done"><b>REINDEX COMPLETE</b> ({this.props.reindexDone} secs)</label>
              : (!this.props.reindexing
                     ? <ReIndexButton />
                     : <span><b>REINDEXING IN PROGRESS</b></span>
              )}
           </span>
		</div>
              :
                <div className="loadWS">
                <LoadButton label="load" workset={this.props.workset} />
                <input value={this.props.workset?this.props.workset:""}
                   onChange={e=>this.props.dispatch({type:"UPDATE_WORKSET",val:e.target.value})} />
                </div>
                }
        <div className="gridDiv">
          {! this.props.fragsLoaded ? null :
                  <button id="playfrags" onClick={e=>{
                          console.log("PLAY GRID")
                          playMeiGrid(this.props.mei,
                                      this.props.selectedFrags,
                                      this.props.frags) }
                  }> ▶ playback </button> }
	  <AssembledGrid />
        </div>
        {! this.props.fragsLoaded ? null :
        <div className="fragRow">
          <MatchSelector />
          <FragmentSelector />
        </div>
        }
      </div>
    );
  }
  componentDidMount() {
    console.log("AppDidMount")
    loadConfig(this.props.dispatch)
  }
}

App=connect(s=>s)(App)
export default App;
