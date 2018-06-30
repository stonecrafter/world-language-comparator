const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: false,
        uglifyOptions: {
          compress: true,
          ecma: 6,
          output: {
            comments: false
          },
          compress: {
            dead_code: true,
            drop_console: true
          }
        }
      })
    ]
  }
});