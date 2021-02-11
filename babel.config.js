const { getIfUtils, removeEmpty } = require('webpack-config-utils')

module.exports = (api) => {
  const production = api.env('production')

  const { ifProduction, ifDevelopment } = getIfUtils(production ? 'production' : 'development')

  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        loose: true,
        bugfixes: true,
        modules: false,
      },
    ],
    '@babel/preset-typescript',
    [
      '@babel/preset-react',
      {
        development: ifDevelopment(true, false),
        runtime: 'automatic',
        importSource: 'preact',
      },
    ],
  ]

  const plugins = removeEmpty([
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: true,
        regenerator: false,
      },
    ],
    '@babel/plugin-syntax-dynamic-import',
    ifProduction('@babel/plugin-transform-react-constant-elements'),
  ])

  return {
    presets,
    plugins,
  }
}
