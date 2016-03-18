# Step 9: Fetching Data

[Back to step 8](https://github.com/mbrochh/django-reactjs-boilerplate/tree/step8_inline_styles)

This is another thing where you have 100 different options and I'm not sure
if this is the best way to do it. There are new technologies evolving like
Relay and GraphQL that will make this step even easier. For me, the technique
presented here works very well for a mobile app and ReactJS web-components in
production, so I guess it's OK to share this.

At the moment, our components are pretty dumb because they can't fetch data
from the outside world (i.e. API endpoints). We are going to use
[fetch](https://github.com/github/fetch) which is a Polyfill for Browsers and
does something similar to `jQuery.ajax()`.

In this example, let's try to fetch all my repos from the public Github API and
display them.

The problem with HTTP requests is that so many things can go wrong. The server
might return a 404 or a 500 error or might be completely offline so that the
request times out or you might even not have a network connection at all. In
order to deal with all these errors, I wrote a little wrapper around the
`fetch` function. Let's create a file `utils.js` in the `reactjs` folder:

```javascript
import fetch from "isomorphic-fetch"

export function request(url, options, success, error400, error, failure) {
  let headers = new Headers()
  headers.append("Content-Type", "application/json")
  headers.append("Accept", "application/json")
  options["headers"] = headers
  return fetch(url, options)
    .then(res => {
      if (res.status >= 200 && res.status < 300) {
        // for anything in 200-299 we expect our API to return a JSON response
        res.json().then(json => { return success(json) })
      } else if (res.status === 400) {
        // even for 400 we expect a JSON response with form errors
        res.json().then(json => { return error400(json) })
      } else {
        // For all other errors we are not sure if the response is JSON,
        // so we just want to display a generic error modal
        return error(res)
      }
    }).catch((ex) => { return failure(ex) })
}
```

Let's break this down. You will notice that we are actually not using Github's
`fetch` but something else called `isomorphic-fetch`. This makes sure that your
`fetch()` calls work both on the server (with Node.js) and in the browser.

The wrapper function that I "invented" is called `request`. It takes a lot of
parameters:

1. The `url` that should be called
1. An object called `options` that allows us to pass further options into the
   `fetch` function - we are not using this in this example.
1. A callback function called `success` - This function will be executed when
   `fetch` returns a successful response. Before calling the function, we will
   parse the response through `.json()`.
1. A callback function called `error400` which will be called if fetch returns
   with a 400 error.
1. A callback function called `error` which will be called if fetch returns
   with any other kind of error, for example a 500 Internal Server Error.
1. A callback function called `failure` which will be called if the fetch call
   completely crashed, for example because you don't have a network connection.

This looks all really scary, but this is one of those files that you write once
and then never look at it again. So if you want, you can just copy and paste
this and then forget about it.

Now we need to create action creators for Redux. Create a file
`actions/githubActions.js` with the following content:

```javascript
import { request } from "../utils"

export const FETCH_REPOS = "FETCH_REPOS"
export const FETCH_REPOS_SUCCESS = "FETCH_REPOS_SUCCESS"
export const FETCH_REPOS_ERROR400 = "FETCH_REPOS_ERROR400"
export const FETCH_REPOS_ERROR500 = "FETCH_REPOS_ERROR500"
export const FETCH_REPOS_FAILURE = "FETCH_REPOS_FAILURE"
export function fetchRepos() {
  return function (dispatch) {
    let url = "https://api.github.com/users/mbrochh/repos"
    dispatch({type: FETCH_REPOS})
    return request(
      url, {},
      (json) => { dispatch({type: FETCH_REPOS_SUCCESS, res: json}) },
      (json) => { dispatch({type: FETCH_REPOS_ERROR400, res: json}) },
      (res) => { dispatch({type: FETCH_REPOS_ERROR500, res: res}) },
      (ex) => { dispatch({type: FETCH_REPOS_FAILURE, error: ex}) },
    )
  }
}
```

As you can see, we are importing our very own `request` function which we have
just created. Then we create constants for the different kinds of events that
this action can trigger. Those are the very same events that can happen in a
typical `fetch` call, namely "success", "error 400", "any other error" and
"network failure".

Next we write a function called `fetchRepos()`. Now something weird is going on.
From the action creator in `counterActions.js` you might remember that the
action creator is supposed to return an object that looks like this:

```javascript
return {type: SOME_CONSTANT}
```

This works fine for simple actions that just do one thing. In this case our
action can trigger many different events and to make things worse, they happen
asynchronously (we don't know when the fetch request will return). For this
use-case, Redux allows us to write an action creator that doesn't return an
object like above but returns another function that takes the `dispatch`
parameter. Inside of this function we can do whatever we want and dispatch
actions directly.

The first thing that we do is to dispatch "FETCH_REPOS", this signals that we
have started fetching Github repositories. Then we call our `request` function
and pass in the `url`, an empty object for `options` and four anonymous
functions as callback functions for the various fetch events. Each callback
function does nothing else than return a Redux compatible object with the
corresponding event and the event data (i.e. the JSON response or the error
object).

Now that we have action creators, we can implement a reducer that listens to
those actions. Create a file `reducers/github.js`:

```javascript
import * as githubActions from "../actions/githubActions"

const initialState = {
  isLoadingRepos: false,
  repos: undefined,
}

export default function github(state=initialState, action={}) {
  switch (action.type) {
  case githubActions.FETCH_REPOS:
    return {...state, isLoadingRepos: true}
  case githubActions.FETCH_REPOS_SUCCESS:
    return {...state, isLoadingRepos: false, repos: action.res}
  case githubActions.FETCH_REPOS_ERROR400:
  case githubActions.FETCH_REPOS_ERROR500:
  case githubActions.FETCH_REPOS_FAILURE:
    return {...state, isLoadingRepos: false}
  default:
    return state
  }
}
```

Reducers are always the same: You have some initial state where everything is
empty and then you have a function with a big switch-statement. In the
switch-statement you define which events you are listening to - you can see that
those are basically just the constants that we defined in our action creator
file. Every time this reducer picks up an action that it is interested in,
it will return a copy of `state` and change one or more fields of the state to
a new value.

You also need to update your `reducers/index.js` so that this new reducer is
added to the list of reducers that your app is aware of:

```javascript
export { default as counters } from "./counters"
export { default as github } from "./github"
```

Finally you can now use your new reducer in your components. For this, we need
to change a lot of code in `containers/App1Container.jsx`.

First of all, import your new action creator. I'm also importing a new component
called `GithubRepos` here which we will implement next a bit further down.

```javascript
import * as counterActions from "../actions/counterActions"
import * as githubActions from "../actions/githubActions"
import Headline from "../components/Headline"
import GithubRepos from "../components/GithubRepos"
```

Next you need to connect the new reducer to your component. Again, the key
(i.e. `counters` or `github`) defines how the reducer is named in this
component's props (so it will be `this.props.github`) and the value
(i.e. `state.github`) refers to the name with which you imported the reducer in
`reducers/index.js`:

```javascript
@connect(state => ({
  counters: state.counters,
  github: state.github,
}))
```

Now you need to make sure that your component calls the new `fetchRepos` action
as soon as it mounts:

```javascript
componentDidMount() {
  let {dispatch, github} = this.props
  if (!github.isLoadingRepos && github.repos === undefined) {
    dispatch(githubActions.fetchRepos())
  }
}
```

I like to add a `renderLoading()` function to my components that displays a
loading screen while it is fetching it's data:

```javascript
renderLoading() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          Loading...
        </div>
      </div>
    </div>
  )
}
```

And finally we update our `render()` function to either show the loading
screen or show the full app:

```javascript
render() {
  let {counters, github} = this.props
  if (github.isLoadingRepos || github.repos === undefined) {
    return this.renderLoading()
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <Headline>Sample App!</Headline>
          <div style={[styles.button]} onClick={() => this.handleClick()}>INCREASE</div>
          <p style={[styles.counter]}>{counters.clicks}</p>
          <p>{process.env.BASE_API_URL}</p>
          {github.repos !== undefined &&
            <GithubRepos repos={github.repos} />
          }
        </div>
      </div>
    </div>
  )
}
```

You can see that in the case where `{github.repos !== undefined && }` we want
to render our new `GithubRepos` component, so we need to implement this
component as well. Create a new file `components/GithubRepos.jsx`:

```javascript
import React from "react"

export default class GithubRepos extends React.Component {
  render() {
    let {repos} = this.props
    let repoNodes = []
    repos.forEach((item, index) => {
      let node = (
        <div key={item.id}>{item.name}</div>
      )
      repoNodes.push(node)
    })

    return (
      <div>{repoNodes}</div>
    )
  }
}
```

All it does is iterating over the repos that have been passed in as props and
then creating a new node for each component. NOTE: When you create components
in a loop like this, you must give them a unique `key` attribute.

All this is quite a lot to take in. It took me several months to come up with
this workflow but once you have your `utils.js` in place, the worst suffering
is over and you can just focus on writing action creators and reducers, which
is actually quite fun!
