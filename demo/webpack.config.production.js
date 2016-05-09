'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    demo1: __dirname + '/demo1/app.js',
  },
  devtool: false,
  output: {
    path: __dirname,
    filename: '[name]/build.js',
  },
  resolve: {
    alias: {
      'react-doc': path.join(__dirname, '..', 'lib/index.js'),
    },
  },
  webpackServer: {
    hot: true,
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          __dirname,
        ],
        exclude: [
          path.join(__dirname, '..', 'node_modules/babel-standalone'),
        ]
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};
