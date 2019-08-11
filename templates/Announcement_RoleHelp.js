import CONSTANTS from '../constants';

import Template from './Template';

export default class RoleHelp extends Template {
  constructor(variables) {
    super('role-help', variables, {
      roles: {
        role1: '111',
        role2: '222',
      },
    });
  }

  embed() {
    return {
      description: CONSTANTS.MESSAGE.SEPARATOR,
      color: 11962861,
      thumbnail: {
        url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/Infoicon.png`,
      },
      author: {
        name: 'CONSTRUCT COMMUNITY ROLE HELPER',
        icon_url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordNotifyicon.png`,
      },
      fields: [
        {
          name: 'Step By Step Guide:',
          value: '**1.** Select any available role\n**2.** Write the command \'!iam\' in the messagebox\n**3.** Add an empty space followed by the role\nᅠ',
        },
        {
          name: 'Example:',
          value: '*!iam gamedesigner*\nᅠ',
        },
        {
          name: 'Available Roles:',
          value: '`!rolelist`\nᅠ',
        },
      ],
      footer: {
        text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
      },
    };
  }
}
