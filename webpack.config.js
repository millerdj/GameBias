module.exports = {
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: './public',
    filename: 'bundle.js'
  },
  devServer: {
    port: 3000,
    contentBase: './public',
    inline: true,
  },
  module: {
  loaders: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }
  ]
}
