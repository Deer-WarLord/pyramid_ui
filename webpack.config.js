var webpack = require('webpack');
var ModernizrWebpackPlugin = require('modernizr-webpack-plugin');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: ['king-theme', './app/driver.js'],
  module: {
    rules: [
        {
            test: /\.html$/,
            loader: 'underscore-template-loader'
        },
        {
            test: /\.(jpe?g|png|gif)$/i,
            loader:"file-loader",
            query:{
                name:'[name].[ext]',
                outputPath: '../../static/images/'
            }
        },
        {
            test: /\.(eot|svg|ttf|woff|woff2)$/,
            loader:"file-loader",
            query:{
                name:'[name].[ext]',
                outputPath: '../../static/fonts/'
            }
        },
        {
            test: /\.css$/,
            // loaders: ExtractTextPlugin.extract('style-loader', 'css-loader')
            loaders: ['style-loader', 'css-loader']
        },
        {
            test: /assets\/js\/plugins\/datatable\/\.*/,
            loader: 'imports-loader?define=>false'
        }
    ]
  },
  output: {
    path: __dirname + '/../mainapp/mainapp/static/js',
    filename: 'app.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: 'underscore',
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      // 'window.moment': "assets/js/plugins/moment/moment"
    }),
    new ModernizrWebpackPlugin()
    // new ExtractTextPlugin('app.[hash].css')
  ],
  resolve: {
      modules: [__dirname + '/node_modules', __dirname + '/app', __dirname + '/app/assets/js'],
  },
  resolveLoader: {
    modules: [__dirname + '/node_modules']
  }
};
