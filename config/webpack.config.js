const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require("copy-webpack-plugin");

const path = require('path')

module.exports = env => {
  return {
    mode: env.mode,
    devtool: 'inline-source-map',
    devServer: {
      port: 3000,
      hot: true
    },
    entry: {
      index: './src/index.js'
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: '[name].bundle.js'
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          extractComments: false
        })
      ]
    },
    resolve: {
      modules: ['node_modules'],
      alias: {
        '@': path.resolve(__dirname, '../src')
      },
      extensions: ['.js', '.jsx']
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        chunks: ['index']
      }),
      env.mode === 'production' &&
      new CopyPlugin({
        patterns: [{ from: 'public', to: '', noErrorOnMissing: true }]
      })
    ],
    module: {
      rules: [
        {
          test: /\.html$/,
          use: ['html-loader']
        },
        {
          test: /\.js|jsx$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        },
        {
          test: /\.css$/i,
          use:
            env.mode === 'production'
              ? [MiniCssExtractPlugin.loader, 'css-loader']
              : ['style-loader', 'css-loader']
        },
        {
          test: /\.s[ac]ss$/i,
          use:
            env.mode === 'production'
              ? [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
              : ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'img'
              }
            }
          ]
        }
      ]
    }
  }
}
