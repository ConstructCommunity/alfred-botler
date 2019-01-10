import CONSTANTS from '../constants';

export default variables => ({
  description: CONSTANTS.MESSAGE.SEPARATOR,
  color: 15844367,
  thumbnail: {
    url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/${variables.icon}.png`,
  },
  author: {
    name: `${variables.roleName} ROLE HAS BEEN ${variables.toggleText}!`,
    icon_url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/AlfredBotlericon.png`,
  },
  fields: [
    {
      name: 'Available Roles (https://lnk.armaldio.xyz/cc_roles):',
      value: Object.keys(variables.roles).join(', '),
    },
  ],
});
