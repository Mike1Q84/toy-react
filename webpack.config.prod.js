const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { merge } = require('webpack-merge')

const baseConfig = require('./webpack.config.base')

module.exports = [
  merge(baseConfig, {
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ]
    },
    plugins: [
      new MiniCssExtractPlugin(),
    ],
    optimization: {
      minimizer: [new UglifyJsPlugin(), new OptimizeCssAssetsPlugin({})],
    },
  }),
]
