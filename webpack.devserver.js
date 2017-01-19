/* eslint-env node */
/* eslint-disable no-console */
'use strict';

const argv = require('yargs').argv;
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const WebpackDevServer = require('webpack-dev-server');

const port = 9000;
const mad = {
  scheme: argv.scheme,
  host: argv.host,
  server: `${argv.scheme}://${argv.host}`,
  wsServer: `${argv.scheme === 'https' ? 'wss' : 'ws'}://${argv.host}`,
  token: argv.token
};

console.log(mad)
const config = require('./webpack.config.js');
config.entry.app.unshift(`webpack-dev-server/client?http://localhost:${port}/`, 'webpack/hot/dev-server');
config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {
  hot: true,
  inline: true,
  historyApiFallback: true,
  proxy: {
    '/madapi/*': {
      target: mad.server,
      headers: {
        'Authorization': `Bearer ${mad.token}`
      },
      xfwd: true,
      changeOrigin: true
    }
  },
  // reduce the console noise
  stats: {
    assets: false,
    colors: true,
    version: false,
    modules: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
    reasons: false,
    cached: true,
    chunkOrigins: true,
    children: false
  }
});

// proxy to mad websocket
const proxy = require('http-proxy').createProxyServer();
proxy.on('error', function () {
  // ignore errors (like websocket connection reset from mad) and just continue
});
server.listeningApp.on('upgrade', function (req, socket) {
  if (req.url.match(/^\/ws\//)) {
    proxy.ws(req, socket, {
      target: mad.wsServer,
      headers: {
        'Authorization': `Bearer ${mad.token}`
      },
      ws: true,
      changeOrigin: true
    });
  }
});

server.listen(9000, (err) => {
  if (err) return console.err(err);
  console.log(`Now listening on http://localhost:${port}`);
});