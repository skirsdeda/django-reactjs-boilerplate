import * as React from "react"
import { render } from "react-dom"
import {
  createStore,
  compose,
  applyMiddleware,
} from "redux"
import { Provider } from "react-redux"
import thunk from "redux-thunk"

import reducer from "./reducers"
import SampleAppContainer from "./containers/SampleAppContainer"

let storeEnhancers = compose(
  applyMiddleware(thunk as any), // circumvent current redux-thunk typings definition
  window['devToolsExtension'] ? window['devToolsExtension']() : f => f
)
let store = createStore(reducer, storeEnhancers)

class SampleApp extends React.Component<{}, {}> {
  render() {
    return (
      <Provider store={store}>
        <SampleAppContainer />
      </Provider>
    )
  }
}

render(<SampleApp/>, document.getElementById('SampleApp'))
