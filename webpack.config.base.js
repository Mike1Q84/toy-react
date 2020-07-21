const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  target: 'web',
  entry: './src/main.js',
  output: {
    path: __dirname + '/dist',
    filename: 'main.js'
  },
  resolve: {
    extensions: [".js", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [[
              "@babel/plugin-transform-react-jsx",
              { pragma: "ToyReact.createElement" },
            ]]
          }
        },
        exclude: /node_modules/,
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
  ],
  node: {
    __dirname: false, // Webpack replace __dirname with / by default
    __filename: false, // Webpack replace __filename with /[filename] by default
  },
}
