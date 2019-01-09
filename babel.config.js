module.exports = (api) => {
  api.cache(false);
  return {
    presets: [
      ['@babel/preset-env', { exclude: ['transform-classes'] }],
    ],
    ignore: [
      'disabled-commands',
    ],
  };
};
