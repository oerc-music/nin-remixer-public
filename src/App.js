import React, { Component } from 'react';
import { connect } from 'react-redux'
import './App.css';

import { LoadButton, loadConfig } from './components/load-fragments';
import { FragList } from './components/fragmentList';
import { FragmentSelector, MatchSelector } from './components/selectedFragments';
import { AssembledGrid} from './components/assembledRow';
import { goTest } from './miditest'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">S.O.F.A. remixer</h1>
        </header>
        {this.props.hideGo ? null : [
                //<button onClick={goTest}>test</button>,
                <div className="loadWS">
                <LoadButton label="load" />
                <input value="http://thalassa.oerc.ox.ac.uk:8080/workset-e82a66/" />
                </div>
                ]}
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
