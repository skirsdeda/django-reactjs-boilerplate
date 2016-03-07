# Step 6: Going to production

There are probably a hundred ways to achieve what we want to do in this step.
You can take my approach as a suggestion or just apply whatever works best
for your case.

One way would be to install all the node dependencies on your server and make
sure that during each deployment you generate the bundles and then call
`collectstatic`.

I prefer to do keep my servers as simple as possible and generate the bundles
locally and commit them to the repository.

Let's assume a typical 2-tier environment where we have a staging server and a
production server. Let's assume that both servers have different URLs, so the
API endpoints on staging all start with `https://sandbox.example.com/api/v1/`
and the ones on production start with `https://example.com/api/v1`. You need to
hard-code these values into your bundles, because that's what your user's
browsers will download and execute.

We need to create a new `webpack.stage.config.js` file and it looks like this:

```javascript
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

var config = require('./webpack.base.config.js')

config.output.path = require('path').resolve('./djreact/static/bundles/stage/')

config.plugins = config.plugins.concat([
  new BundleTracker({filename: './webpack-stats-stage.json'}),

  // removes a lot of debugging code in React
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('staging'),
      'BASE_API_URL': JSON.stringify('https://sandbox.example.com/api/v1/'),
  }}),

  // keeps hashes consistent between compilations
  new webpack.optimize.OccurenceOrderPlugin(),

  // minifies your code
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    }
  })
])

// Add a loader for JSX files
config.module.loaders.push(
  { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' }
)

module.exports = config
```

And likewise, we need to add `webpack.prod.config.js` and it looks like this:

```javascript
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

var config = require('./webpack.base.config.js')

config.output.path = require('path').resolve('./djreact/static/bundles/prod/')

config.plugins = config.plugins.concat([
  new BundleTracker({filename: './webpack-stats-prod.json'}),

  // removes a lot of debugging code in React
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production'),
      'BASE_API_URL': JSON.stringify('https://example.com/api/v1/'),
  }}),

  // keeps hashes consistent between compilations
  new webpack.optimize.OccurenceOrderPlugin(),

  // minifies your code
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    }
  })
])

// Add a loader for JSX files
config.module.loaders.push(
  { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' }
)

module.exports = config
```

And because we are now using the `DefinePlugin` to add environment variables,
we should update our `webpack.local.config.js` like this:

```javascript
config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new BundleTracker({filename: './webpack-stats-local.json'}),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('development'),
      'BASE_API_URL': JSON.stringify('https://'+ ip +':8000/api/v1/'),
  }}),
])
```

We can now create stage and prod bundles like this:

```bash
node_modules/.bin/webpack --config webpack.stage.config.js
node_modules/.bin/webpack --config webpack.prod.config.js
```

For us lazy programmers, that's really too much typing, so let's put that into
a script. Run `pip install Fabric` and add it to `requirements.txt`.

Then add the following `fabfile.py`:

```python
from fabric.api import local

def webpack():
    local('rm -rf djreact/static/bundles/stage/*')
    local('rm -rf djreact/static/bundles/prod/*')
    local('webpack --config webpack.stage.config.js --progress --colors')
    local('webpack --config webpack.prod.config.js --progress --colors')
```

Your workflow will now look like this:

1. Start `./manage.py runserver`
1. Start `node server.js`
1. Edit your ReactJS app
1. When done, commit your changes
1. Run `fab webpack` and commit your new bundles
1. Run a deployment

On your servers, you will need a `local_settings.py` where you override the
`WEBPACK_LOADER` setting like this:

```python
WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'bundles/stage/',  # end with slash
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats-stage.json'),
    }
}
```

And similar for prod, of course, just replace `stage` with `prod`.
