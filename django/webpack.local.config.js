var path = require("path")
var webpack = require('webpack')
var _ = require('lodash')
var BundleTracker = require('webpack-bundle-tracker')

var config = require('./webpack.base.config.js')
var localSettings = require('./webpack.local-settings.js')

var ip = localSettings.ip
var port = localSettings.port

config.devtool = "source-map"

config.ip = ip;
config.port = port;

// Use webpack dev server
var devServerEntry = [
  'webpack-dev-server/client?http://' + ip + ':' + port,
  'webpack/hot/only-dev-server'
];
config.entry = _.mapValues(
  config.entry,
  function(e) { return _.concat(devServerEntry, e); });

// override django's STATIC_URL for webpack bundles
config.output.publicPath = 'http://' + ip + ':' + port + '/assets/bundles/'

// Add HotModuleReplacementPlugin and BundleTracker plugins
config.plugins = config.plugins.concat([
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
var tsxLoader = _.find(
  config.module.loaders,
  function(l) { return l.test.test('.tsx'); });
tsxLoader.loaders = ['react-hot', 'awesome-typescript'];

config.module.loaders.push(
  { test: /\.css$/, loaders: ['style?sourceMap', config.cssModulesLoaderConfig]});

module.exports = config
