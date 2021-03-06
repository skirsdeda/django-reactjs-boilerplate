var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

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
]);

config.module.loaders.push(
  { test: /\.css$/,
    loader: ExtractTextPlugin.extract('style', config.cssModulesLoaderConfig)});

module.exports = config
