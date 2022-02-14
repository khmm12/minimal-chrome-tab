module.exports = (api) => {
  const linaria = api.caller((caller) => !!caller && caller.name === 'linaria')

  if (linaria) {
    return {
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
