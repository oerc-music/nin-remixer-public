import React, { Component } from 'react';
import { connect } from 'react-redux'
import './App.css';

import { LoadButton, loadConfig } from './components/load-fragments';
import { FragList } from './components/FragList';
import { FragmentSelector, MatchSelector } from './components/FragmentSelector';
import { AssembledGrid} from './components/AssembledGrid';
import { goTest } from './miditest'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">S.O.F.A. remixer</h1>
        </header>
        {this.props.hideGo ? null :
                <div className="loadWS">
                <LoadButton label="load" workset={this.props.workset} />
                <input value={this.props.workset?this.props.workset:""}
                   onChange={e=>this.props.dispatch({type:"UPDATE_WORKSET",val:e.target.value})} />
                </div>
                //<input value="http://thalassa.oerc.ox.ac.uk:8080/workset-e82a66/" />
                }
        {! this.props.fragsLoaded ? null :
        <div className="fragRow">
          <MatchSelector />
          <FragmentSelector />
        </div>
        }
	  <AssembledGrid />
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
