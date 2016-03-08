# Step 8: Inline Styles

This, to me, is the greatest advancement in web development since the invention
of CSS. Do you have humongous stylesheets in your projects where no one ever
dares to delete a style because nobody knows where in the project it might still
be in use? React solves that.

Do you use LESS or SASS and build nicely nested styles like this:

```less
.some-container {
  .some-inner-container {
    .active {
      ...
    }
  }
}
```

And then you want to re-use that `.active` style on some new element but you
can't because that element would have to be wrapped in those other elements
that have the outer styles. React solves that as well.

Update your `App1Container.jsx` to use Radium for styles:

```javascript
import React from "react"
import Radium from "radium"

import { connect } from "react-redux"

import * as counterActions from "../actions/counterActions"
import Headline from "../components/Headline"

const styles = {
  button: {
    cursor: "pointer",
  },
  counter: {
    color: "blue",
    fontSize: "20px",
  }
}

@connect(state => ({
  counters: state.counters,
}))
@Radium
export default class App1Container extends React.Component {
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
            <div style={[styles.button]} onClick={() => this.handleClick()}>INCREASE</div>
            <p style={[styles.counter]}>{counters.clicks}</p>
            <p>{process.env.BASE_API_URL}</p>
          </div>
        </div>
      </div>
    )
  }
}
```

That's it! You define a `styles` object, wrap your class with the `@Radium`
decorator and then use your styles. Remember: It's all just JavaScript. You will
quickly want a `theme.js` file somewhere in your project that all your
components can import so that you can re-use commonly used values like
font-family, font sizes, colors etc.

So far, I have never put anything other than constants into my `theme.js`. All
other markup and component-specific styling happens in the component itself.
Now it is save to change, add and delete styles right there in the component,
because it will only affect that component and developers can see at one glance
what styles are there and where they are used.
