import CONSTANTS from '../constants';

export default variables => ({
  description: variables.description,
  color: 16316662,
  footer: {
    text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
  },
  thumbnail: {
    url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/C2icon.png`,
  },
  author: {
    name: `CONSTRUCT 2 UPDATE (${variables.version}) IS AVAILABLE!`,
    icon_url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/AlfredBotlericon.png`,
  },
  fields: [
    {
      name: CONSTANTS.MESSAGE.SEPARATOR,
      value: CONSTANTS.MESSAGE.EMPTY,
    },
    {
      name: 'View the complete changelog:',
      value: `${CONSTANTS.MESSAGE.SCIRRA_C3RELEASES_PREFIX}${variables.link}`,
    },
  ],
});
