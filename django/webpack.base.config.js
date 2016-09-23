require('es6-promise').polyfill();
var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin

module.exports = {
  context: path.resolve(__dirname, './reactjs'),

  entry: {
    // Add as many entry points as you have container-react-components here
    SampleApp: './SampleApp',
    SampleApp2: './SampleApp2',
    vendors: ['react'],
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
  ], // add all common plugins here

  module: {
    loaders: [] // add all common loaders here
  },

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.ts', '.tsx']
  },
}
