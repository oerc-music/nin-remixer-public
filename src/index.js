import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from  'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { ninReducer } from './reducer'
import update from 'immutability-helper'

const mapState = store => {
  // Hide the large Maps from state
  return update(store.getState(), {mei: {$apply:(m=>"Map:"+m.size)},
                                   svg: {$apply:(m=>"Map:"+m.size)}})
}

const logger = store => next => action => {
    console.group(action.type)
    console.info('%c dispatching', 'color: blue', action)
    let result = next(action)
    console.log('%c next state', 'color: green', mapState(store))
    console.groupEnd()
    return result
}

//const store = createStore(ninReducer, applyMiddleware(thunk))
//const store = createStore(ninReducer, applyMiddleware(thunk, logger))
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(ninReducer,
                          composeEnhancers(applyMiddleware(thunk)))

ReactDOM.render(
      <Provider store={store}>
        <div>
         <App />
         <div style={{position:"fixed",visibility:"hidden"}} id="svgtest" />
        </div>
      </Provider>,
      document.getElementById('root'))

registerServiceWorker()
