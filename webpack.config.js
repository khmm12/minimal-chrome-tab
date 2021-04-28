const { resolve } = require('path')
const Dotenv = require('dotenv-webpack')
const { getIfUtils, removeEmpty } = require('webpack-config-utils')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInjectPreload = require('@principalstudio/html-webpack-inject-preload')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const stylis = require('stylis')

const resolveSrc = (path) => resolve(__dirname, 'src', path)

stylis.set({ prefix: false })

module.exports = (env = {}, argv = {}) => {
  const { ifProduction } = getIfUtils(getEnv(env))

  return removeEmpty({
    mode: ifProduction('production', 'development'),
    devtool: ifProduction(false, 'cheap-module-source-map'),
    entry: removeEmpty({
      main: resolveSrc('index'),
    }),
    output: {
      assetModuleFilename: '[name]-[contenthash][ext]',
      filename: ifProduction('[name]-[contenthash].js', '[name].js'),
      path: resolve(__dirname, 'dist'),
      publicPath: '',
    },
    module: {
      rules: [
        {
          test: /\.(js|ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
            {
              loader: '@linaria/webpack-loader',
              options: {
                sourceMap: ifProduction(false),
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.woff2$/,
          type: 'asset/resource'
        },
      ],
    },
    resolve: {
      extensions: ['.wasm', '.mjs', '.js', '.ts', '.tsx', '.json'],
      alias: {
        '@': resolveSrc(''),
      },
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            output: { comments: false },
          },
        }),
        new CssMinimizerPlugin(),
        new HtmlMinimizerPlugin(),
      ],
    },
    plugins: removeEmpty([
      new Dotenv({
        defaults: true,
      }),
      new MiniCssExtractPlugin({
        filename: ifProduction('[name]-[contenthash].css', '[name].css'),
      }),
      new HtmlWebpackPlugin({
        template: resolveSrc('index.html'),
        filename: 'index.html',
      }),
      new HtmlWebpackInjectPreload({
        files: [
          {
            match: /\.woff2$/,
            attributes: { as: 'font', type: 'font/woff2', crossorigin: true },
          },
        ],
      }),
      ifProduction(new CleanWebpackPlugin()),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: resolveSrc('manifest.json'),
          },
        ],
      }),
    ]),
  })
}

function getEnv(env) {
  if (env.development) return 'development'
  if (env.production) return 'production'
  return process.env.NODE_ENV || 'development'
}
