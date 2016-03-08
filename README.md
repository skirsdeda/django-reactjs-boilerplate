# Step 7: Add Redux

[Back to step 6](https://github.com/mbrochh/django-reactjs-boilerplate/tree/step6_going_to_production)

This step is just a bonus, really. You might want to use some other flux
implementation to manage your components' state, but Redux is really nice to
work with and the de-facto standard at the moment.

The official [Redux documentation](http://redux.js.org) is much better than
anything that I could ever create, so you should read that. For our purposes,
here is what you need to copy & paste:

First you create some **Action Creators** in a new file called `reactjs/actions/counterActions.jsx`:

```javascript
export const INCREASE = "INCREASE"
export function increaseCounter() {
    return {type: INCREASE}
}
```

Any action that can somehow change the state of your app should have a constant
and for each constant there should be a function that returns either another
function or an object with at least `{type: CONSTANT}`. Those objects can have
more data attached, to them, for example `{type: CONSTANT, productId: 1}`. This
data will be accessible in your reducers.

Speaking of which: Reducers are like stores of data. In Python terms, it's
really just a dictionary, usually holding JSON objects that your API has
returned. I like to have one reducer-file for each Django model.

Let's create a reducer in a new file called `reactjs/reducers/counters.js`:

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

See that `{...state, clicks: state.clicks + 1}` line there? That's a new
JavaScript feature called "destructing". It means: "Create a copy of the object
`state` but replace the attribute `clicks` with something new". This is the only
important thing about reducers: They must **never** mutate the state that is
passed into the function. They must always either return the unchanged state or
return a new object. This is why most people like to use [immutable.js](https://github.com/facebook/immutable-js), but so far I have been
too stupid to use it in my projects with Redux :(

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

Next we can upgrade our `App1Container` to make use of Redux via the `@connect`
decorator:

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

Try to run `node server.js` and `./manage.py runserver` and click at the
"INCREASE" link.

[Step 8: Inline styles](https://github.com/mbrochh/django-reactjs-boilerplate/tree/step8_inline_styles)
