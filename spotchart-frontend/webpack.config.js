var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var path = require("path");

var src = path.resolve(__dirname, "src");
var output = path.resolve(__dirname, "../spotchart/src/main/resources/public");

var config = {
  entry: src + "/index.js",
  output: {
    path: output,
    filename: "bundle.js"
  },
  plugins: [
    new InterpolateHtmlPlugin({
      PUBLIC_URL: '.'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve('public/index.html'),
    })
  ],
  module: {
    loaders: [{
        include: src,
        loader: "babel"
    },
	{ test: /\.css$/, loader: "style-loader!css-loader" },
	]
  }
};

module.exports = config;