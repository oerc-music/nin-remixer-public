import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from  'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import update from 'immutability-helper'

//function appReducer(s = {items:["Foo", "Boo", "Baz"]} ,a) {
//  return s
//}
const emptyState = {frags:[],
                    mei:new Map(),
                    svg:new Map(),
                    selectedFrags: [{cursor: true}]}

function ninReducer(state = emptyState, action) {
  switch (action.type) {
    case 'SET_FRAGS':
      for (let f of action.frags) {
        f.keydisp = f.key.replace('b','♭')
      }
      return update (state, {frags: {$set: action.frags}})
    case 'SET_MEI':
      //console.log(state)
      return update(state, {mei: {$add: [[action.uri, action.mei]]},
                            svg: {$add: [[action.uri, action.svg]]} })
    case 'SELECT_FRAG':
      // Set the id of current fragment
      var newstate = update(state, {selectedFrags: {[action.index]: {
              $set: { id: action.id}
              }}
        })
      // add a new blank one
      newstate = update(newstate, {selectedFrags:
              {$splice: [[action.index+1, 0, {cursor: true}]] }
        })
      return newstate
    default:
      return state
  }
}

const store = createStore(ninReducer, applyMiddleware(thunk))

ReactDOM.render(
      <Provider store={store}>
         <App />
      </Provider>,
      document.getElementById('root'))

registerServiceWorker()
