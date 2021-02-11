const { resolve } = require('path')
const { getIfUtils, removeEmpty } = require('webpack-config-utils')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
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
      path: resolve(__dirname, 'dist'),
      filename: ifProduction('[name]-[contenthash].js', '[name].js'),
      publicPath: '',
    },
    module: {
      rules: [
        {
          test: /\.(js|ts|tsx)$/i,
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
          test: /\.woff2$/i,
          use: {
            loader: 'url-loader',
            options: {
              limit: 4096,
              name: '[name]-[hash].[ext]',
            },
          },
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
            ecma: 2020,
            output: { comments: false },
          },
        }),
        new CssMinimizerPlugin(),
      ],
    },
    plugins: removeEmpty([
      new MiniCssExtractPlugin({
        filename: ifProduction('[name]-[contenthash].css', '[name].css'),
      }),
      new HtmlWebpackPlugin({
        template: resolveSrc('index.html'),
        filename: 'index.html',
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
