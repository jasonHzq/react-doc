'use strict';

var path = require('path');

module.exports = {
  entry: {
    demo1: __dirname + '/demo1/app.js',
  },
  devtool: 'inline-source-map',
  output: {
    path: __dirname,
    filename: '[name]/build.js',
  },
  resolve: {
    alias: {
      'react-doc': path.join(__dirname, '..', 'src/index.js'),
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
          path.join(__dirname, '..', 'src'),
          path.join(__dirname, '..', 'node_modules'),
        ],
        exclude: [
          path.join(__dirname, '..', 'node_modules/babel-standalone'),
        ]
      },
    ],
  },
};
