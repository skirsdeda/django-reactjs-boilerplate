var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var config = require('./webpack.base.config.js')
var localSettings = require('./webpack.local-settings.js')

var ip = localSettings.ip

config.devtool = "source-map"

config.ip = ip

// Use webpack dev server
config.entry = {
  SampleApp: [
    'webpack-dev-server/client?http://' + ip + ':3000',
    'webpack/hot/only-dev-server',
    './SampleApp',
  ],
  SampleApp2: [
    'webpack-dev-server/client?http://' + ip + ':3000',
    'webpack/hot/only-dev-server',
    './SampleApp2',
  ]
}

// override django's STATIC_URL for webpack bundles
config.output.publicPath = 'http://' + ip + ':3000' + '/assets/bundles/'

// Add HotModuleReplacementPlugin and BundleTracker plugins
config.plugins = config.plugins.concat([
  new ExtractTextPlugin('app.css', {allChunks: true}),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new BundleTracker({filename: './webpack-stats-local.json'}),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('development'),
      'BASE_API_URL': JSON.stringify('http://' + ip + ':8000/api/v1/'),
  }}),

])

// Add a loader for TSX files
var srcDir = path.resolve(__dirname, './reactjs')
config.module.loaders = config.module.loaders.concat([
  { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]')},
  { test: /\.ts$/, include: srcDir, loader: 'awesome-typescript' },
  { test: /\.tsx$/, include: srcDir, loaders: ['awesome-typescript'/*, 'react-hot'*/] }
])

module.exports = config
