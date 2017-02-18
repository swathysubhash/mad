/*eslint-env node*/
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
var ManifestPlugin = require('webpack-manifest-plugin');
var webpack = require('webpack');
module.exports = {
  entry: {
    app: [
      './webapp/index.html',
      './webapp/index.js'
    ]
  },
  output: {
    filename: 'static/app.[chunkhash:8].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  devtool: '#source-map',
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          // presets: [require.resolve('babel-preset-inferno-app')],
          plugins: ['inferno', 'transform-object-rest-spread']
        }
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          'css?sourceMap!' +
          'less?sourceMap'
        )
      },
      {
        test: /index\.html$/,
        loader: 'file?name=[name].[ext]'
      }
    ]
  },
  externals: {
    // 'moment': 'moment',
    // 'react': 'React',
    // 'react-dom': 'ReactDOM',
    // 'react-router': 'ReactRouter',
    // 'superagent': 'superagent'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new ExtractTextPlugin('static/app.[chunkhash:8].css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // Inferno doesn't support IE8
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        semicolons: false,
        screw_ie8: true
      }
    }),
    new CopyWebpackPlugin([
        { from: 'images', to: 'static' }
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]
};
