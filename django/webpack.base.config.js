require('es6-promise').polyfill();
var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin

var srcDir = path.resolve(__dirname, './reactjs');
var cssModulesLoaderConfig = 'css?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]';

module.exports = {
  context: srcDir,

  entry: {
    // Add as many entry points as you have container-react-components here
    SampleApp: './SampleApp',
    SampleApp2: './SampleApp2',
    //vendors: ['es6-promise', 'isomorphic-fetch', 'lodash', 'react-dom'],
  },

  output: {
      path: path.resolve(__dirname, './djreact/static/bundles/local/'),
      filename: "[name]-[hash].js"
  },

  externals: [
  ], // add all vendor libs

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    new ForkCheckerPlugin(),
    new ExtractTextPlugin('app.css', {allChunks: true}),
  ], // add all common plugins here

  cssModulesLoaderConfig: cssModulesLoaderConfig,

  module: {
    loaders: [ // add all common loaders here
      { test: /\.ts$/, loaders: ['awesome-typescript'] },
      { test: /\.tsx$/, loaders: ['awesome-typescript'] }
    ]
  },

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.ts', '.tsx']
  },
}
