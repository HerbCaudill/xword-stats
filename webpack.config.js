/* eslint-disable no-undef */ // because __dirname is undefined

'use strict';

const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  cache: true,
  devtool: 'cheap-module-eval-source-map',
  entry: { app: './client/app.js' },
  output: {
    path: __dirname,
    filename: '[name].js',
    chunkFilename: '[hash]/js/[id].js',
    hotUpdateMainFilename: '[hash]/update.json',
    hotUpdateChunkFilename: '[hash]/js/[id].update.js',
    publicPath: '/dist/',
  },
  node: {
    fs: false,
    Buffer: false,
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: [/node_modules/, /scripts[\\/]lib/],
        use: [{ loader: 'eslint-loader' }],
      },
      {
        test: /\.scss/,
        use: [
          {
            loader: 'style-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['node_modules/'],
              sourceMap: true,
            },
          },
        ],
        exclude: /node_modules/, // Don't build scss within node_modules
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        use: [{ loader: 'file-loader' }],

      },
      {
        test: /\.html$/,
        use: [{ loader: 'html-loader' }],
      },
      {
        test: /\.svg$/,
        use: [{ loader: 'svg-loader' }],
      }],
  },

  resolve: {
    extensions: [
      '.js',
    ],
    modules: [`${__dirname}/node_modules`],
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new WebpackNotifierPlugin,
  ],

  devServer: {
    contentBase: '.',
    disableHostCheck: true,
    port: 9000,
    historyApiFallback: true,
    proxy: {
      '/stats': 'http://127.0.0.1:9001',
    },
  },
};

