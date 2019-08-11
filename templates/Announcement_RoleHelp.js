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
        name: 'HOW TO ADD/REMOVE SELECTED ROLES',
        icon_url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordNotifyicon.png`,
      },
      fields: [
        {
          name: 'Step by step guide:',
          value: '**1.** Select any role (see available roles below)\n**2.** Write the command \'!iam\' in the messagebox\n**3.** Add an empty space followed by your role\nᅠ',
        },
        {
          name: 'Example:',
          value: '*!iam gamedesigner*\nᅠ',
        },
        {
          name: 'Role List:',
          value: '*!rolelist*\nᅠ',
        },
      ],
      footer: {
        text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
      },
    };
  }
}
