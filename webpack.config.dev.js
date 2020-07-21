const { merge } = require('webpack-merge')

const baseConfig = require('./webpack.config.base')

module.exports = [
  merge(baseConfig, {
    mode: 'development',
    devServer: {
      writeToDisk: true,
      port: 3000,
      noInfo: false,
      stats: 'errors-only',
      historyApiFallback: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/,
        poll: 100,
      },
    },
    optimization: {
      minimize: false
    },
  }),
]
