const webpack = require('webpack');
const path = require('path');


module.exports = {
  entry: { index: './src/index.js'},
  module: {
    rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './build',
    hot: true,
  },
  output: {
    path: __dirname + '/build',
    filename: "[name].js"
  }
};