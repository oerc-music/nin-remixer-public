import React, { Component } from 'react';
import './App.css';

import { LoadButton } from './components/load-fragments';
import { FragList } from './components/fragmentList';
import { FragmentSelector } from './components/selectedFragments';
import { AssembledRow} from './components/assembledRow';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Numbers into Notes - remixer</h1>
        </header>
        <LoadButton label="go" />
        <div className="fragRow">
		  <FragmentSelector />
		  <AssembledRow />
        </div>
      </div>
    );
  }
}

export default App;
