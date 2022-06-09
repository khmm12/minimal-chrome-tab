module.exports = (api) => {
  const linaria = api.caller((caller) => caller?.name === 'linaria')

  if (linaria) {
    return {
      presets: ['@babel/preset-typescript'],
      plugins: [
        [
          'module-resolver',
          {
            root: [require('path').resolve(__dirname)],
            alias: {
              '@': './src',
            },
          },
        ],
      ],
    }
  }

  return {
    presets: [],
    plugins: [],
  }
}
