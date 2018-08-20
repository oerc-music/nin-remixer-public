import React, { Component } from 'react';
import { connect } from 'react-redux'
import './App.css';

import { LoadButton } from './components/load-fragments';
import { FragList } from './components/fragmentList';
import { FragmentSelector, MatchSelector } from './components/selectedFragments';
import { AssembledGrid} from './components/assembledRow';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">S.O.F.A. remixer</h1>
        </header>
        {this.props.hideGo ? null : <LoadButton label="go" />}
        <div className="fragRow">
          <MatchSelector />
          <FragmentSelector />
        </div>
	  <AssembledGrid />
      </div>
    );
  }
}

App=connect(s=>s)(App)
export default App;
