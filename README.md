# Step 3: Add django-webpack-loader

[Back to step 2](https://github.com/mbrochh/django-reactjs-boilerplate/tree/step2_add_non_react_views)

Unfortunately, in this step a lot of stuff will happen all at once. This is
the step where most people give up, because Webpack is one monster of a tool
and super hard to understand and to configure.

Let's try to walk through this step by step.

First of all we need to run `pip install django-webpack-loader` and of course
we will also add it to `requirements.txt`. Tip: Whenever you install something
with `pip`, run `pip freeze` immediately after and copy and paste that package
with it's version number into your `requirements.txt`.

Next we need to add this reusable Django app to the `INSTALLED_APPS` setting
in our `settings.py`:

```python
INSTALLED_APPS = [
    ...
    'webpack_loader',
]
```

ReactJS is all about creating "bundles" (aka minified JavaScript files). These
bundles will be saved in our `static` folder, just like we always used to do it
with our CSS and JS files. So we need to make Django aware of this `static`
folder in `settings.py`:

```python
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'djreact/static'),
]
```

Next we need to create a `package.json` file, which is something similar to
Python's `requirements.txt` file:

```json
{
  "name": "djreact",
  "version": "0.0.1",
  "devDependencies": {
    "babel": "^6.5.2",
    "babel-core": "^6.6.5",
    "babel-eslint": "^5.0.0",
    "babel-loader": "^6.2.4",
    "babel-plugin-transform-decorators-legacy": "^1.3.4",
    "babel-preset-es2015": "^6.6.0",
    "babel-preset-react": "^6.5.0",
    "babel-preset-stage-0": "^6.5.0",
    "eslint": "^2.2.0",
    "react": "^0.14.7",
    "react-hot-loader": "^1.3.0",
    "redux-devtools": "^3.1.1",
    "webpack": "^1.12.13",
    "webpack-bundle-tracker": "0.0.93",
    "webpack-dev-server": "^1.14.1"
  },
  "dependencies": {
    "es6-promise": "^3.1.2",
    "isomorphic-fetch": "^2.2.1",
    "lodash": "^4.5.1",
    "radium": "^0.16.6",
    "react-cookie": "^0.4.5",
    "react-dom": "^0.14.7",
    "react-redux": "^4.4.0",
    "redux": "^3.3.1",
    "redux-thunk": "^1.0.3"
  }
}
```

I won't explain in detail what each package is good for. Finding out what you
really need is essentially one of the really hard parts when starting out
with ReactJS. Describing the reasons behind each of these packages would go
far beyond the scope of this quick tutorial. A lot of this stuff has to do with
[Babel](http://babeljs.io), which is a tool that "transpiles" cutting edge
JavaScript syntax into something that browsers support.

When you have created the file, you can install the packages via `npm intsall`.
This will create a `node_modules` folder, so we should also add that folder to
`.gitignore`. If you don't have `npm` installed, now is a good time to google
for it and find out how to install it on your OS.

After you ran `npm install`, you should be able to use `webpack` - in theory.

In praxis, you need to create quite a monstrous config first. I will cheat a
little bit and already split it into two files because that will be quite
helpful later. The first file is called `webpack.base.config.js` and looks
like this:

```javascript
var path = require("path")
var webpack = require('webpack')

module.exports = {
  context: __dirname,

  entry: {
    // Add as many entry points as you have container-react-components here
    App1: './reactjs/App1',
    vendors: ['react'],
  },

  output: {
      path: path.resolve('./djreact/static/bundles/local/'),
      filename: "[name]-[hash].js"
  },

  externals: [
  ], // add all vendor libs

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
  ], // add all common plugins here

  module: {
    loaders: [] // add all common loaders here
  },

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.jsx']
  },
}
```

It does a lot of things:

1. It defines the entry point. That is the JS-file that should be loaded first
1. It defines the output path. This is where we want to save our bundle.
1. It uses the `CommonsChunksPlugin`, this makes sure that ReactJS will be
   saved as a different file (`vendors.js`), so that our actual app-bundle
   doesn't become too big.

The second file is called `webpack.local.config.js` and looks like this:

```javascript
var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')
var config = require('./webpack.base.config.js')

config.devtool = "#eval-source-map"

config.plugins = config.plugins.concat([
  new BundleTracker({filename: './webpack-stats-local.json'}),
])

config.module.loaders.push(
  { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['react-hot', 'babel'] }
)

module.exports = config
```

This essentially loads the base config and then adds a few things to it, most
notably one more plugin: The `BundleTracker` plugin.

This plugin creates a JSON file every time we generate bundles. Django can then
read that JSON file and will know which bundle belongs to which App-name (this
  will make more sense later).

We will be using bleeding edge ES2015 JavaScript syntax for all our JavaScript
code. A plugin called `babel` will "transpile" the advanced code back into
something that browsers can understand. For this to work, we need to create
the following `.babelrc` file:

```json
{
  "presets": ["es2015", "react", "stage-0"],
  "plugins": [
    ["transform-decorators-legacy"],
  ]
}
```

Now we could use `webpack` to create a bundle, but we haven't written any
JavaScript or ReactJS code, yet.

First, create a `reactjs` folder and put a `App1.jsx` file inside. This is going
to be one of our entry-points for bundling. `webpack` will look into that file
and then follow all it's imports and add them to the bundle, so that in the end
we will have one big `App1.js` file that can be used by the browser.

```javascript
import React from "react"
import { render } from "react-dom"

import App1Container from "./containers/App1Container"

class App1 extends React.Component {
  render() {
    return (
      <App1Container />
    )
  }
}

render(<App1/>, document.getElementById('App1'))
```

As you can see, this file tries to import another component called
`App1Container`. So let's create that one as well in the file
`containers/App1Container.jsx`:

```javascript
import React from "react"

import Headline from "../components/Headline"

export default class App1Container extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <Headline>Sample App!</Headline>
          </div>
        </div>
      </div>
    )
  }
}
```

And once again, that component imports another component called `Headline`.
Let's create that one as well in `components/Headline.jsx`:

```javascript
import React from "react"

export default class Headline extends React.Component {
  render() {
    return (
      <h1>{ this.props.children }</h1>
    )
  }
}
```

You might wonder why I am using a component `App1` and another one
`App1Container`. This will make more sense a bit later. We will be using
something called `Redux` to manage our app's state and you will see that Redux
requires quite a lot of boilerplate to be wrapped around your app. To keep my
files cleaner, I like to have one "boilerplate" file, which then imports the
actual ReactJS component that I want to build.

You will also notice that I separate my components into a `containers` folder
and into a `components` folder. You can think about this a bit like Django
views. The main view template is your container. It contains the general
structure and markup for your page. In the `components` we will have much
smaller components that do one thing and one thing well. These components will
be re-used and orchestrated by all our `container` components, they would be the
equivalent of smaller partial templates that you import in Django using the
`{% import %}` tag.

At this point you can run `node_modules/.bin/webpack --config webpack.local.config.js`
and it should generate some files in `djreact/static/bundles/`.

[Step 4: Use the bundle](https://github.com/mbrochh/django-reactjs-boilerplate/tree/step4_use_the_bundle)
