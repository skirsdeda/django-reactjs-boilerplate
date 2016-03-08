# Step 7: Add Redux

[Back to step 6](https://github.com/mbrochh/django-reactjs-boilerplate/tree/step6_going_to_production)

This step is just a bonus, really. You might want to use some other pattern
to manage your component's state, but Redux is really nice to work with.

The official Redux documentation is much better than anything that I could ever
create, so you should read that. For our purposes, here is what you need to do:

First you create some **Action Creators** in a new file called `reactjs/actions/counterActions.jsx`:

```javascript
export const INCREASE = "INCREASE"
export function increaseCounter() {
    return {type: INCREASE}
}
```

Next you create a so called reducer in a new file called
`reactjs/reducers/counters.js`:

```javascript
import * as sampleActions from "../actions/counterActions"

const initialState = {
  clicks: 0,
}

export default function submissions(state=initialState, action={}) {
  switch (action.type) {
  case sampleActions.INCREASE:
    return {...state, clicks: state.clicks + 1}
  default:
    return state
  }
}
```

Because we usually have many reducers (i.e. one for every Django model),
I like to export them all in a file `reactjs/reducers/index.js`:

```javascript
export { default as counters } from './counters'
```

In one of the earlier steps I mentioned that Redux requires to setup quite
a bit of boilerplate around your root-component. This is what we will do now
in `App1.jsx`:

```javascript
import React from "react"
import { render } from "react-dom"
import {
  createStore,
  compose,
  applyMiddleware,
  combineReducers,
} from "redux"
import { Provider } from "react-redux"
import thunk from "redux-thunk"

import * as reducers from "./reducers"
import App1Container from "./containers/App1Container"

let finalCreateStore = compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)
let reducer = combineReducers(reducers)
let store = finalCreateStore(reducer)

class App1 extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <App1Container />
      </Provider>
    )
  }
}

render(<App1/>, document.getElementById('App1'))
```

That's a lot of magic that will make more sense to you when you read the full
Redux documentation. Basically we are importing all our reducers and composing
them into a store and then we wrap that `<Provider />` component around our
actual root-component.

Next we can upgrade our `App1Container` to make use of Redux:

```javascript
import React from "react"

import { connect } from "react-redux"

import * as counterActions from "../actions/counterActions"
import Headline from "../components/Headline"

@connect(state => ({
  counters: state.counters,
}))
export default class SampleAppContainer extends React.Component {
  handleClick() {
    let {dispatch} = this.props;
    dispatch(counterActions.increaseCounter())
  }

  render() {
    let {counters} = this.props
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <Headline>Sample App!</Headline>
            <div onClick={() => this.handleClick()}>INCREASE</div>
            <p>{counters.clicks}</p>
            <p>{process.env.BASE_API_URL}</p>
          </div>
        </div>
      </div>
    )
  }
}
```

Do you see now why I like to have `App1.jsx` as an entry point and
`App1Container.jsx` as the actual root-component? As we "reactify" parts of
our existing Django app step by step, each of our ReactJS apps will want to have
access to Redux, so we will put that boilerplate around it's entry file. However
at some time in the future we might reach a point where our ReactJS codebase is
larger than our Django-template codebase and we might want to make the last
final step and migrate everything over to 100% React. We will end up with just
one single entry point (if we can turn the site into a SPA) or at least much
lesser entry-points than before, so we can just delete those files in the
`reactjs` root folder. We would then probably use something like react-router
to compose our actual root-components in the `containers` folder.

Oh and by the way! You should totally install this Chrome Extension:
https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd

Once you have that and you visit your site, you can open the developer tools
with `COMMAND+OPTION+i` and there will be a `Redux` tab which will show you
all actions that are being fired and the new values in your reducers after the
action has fired. This is unbelievably helpful for debugging!

[Step 8: Inline styles](https://github.com/mbrochh/django-reactjs-boilerplate/tree/step8_inline_styles)
