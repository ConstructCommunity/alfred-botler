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

  toEmbed() {
    return {
      description: CONSTANTS.MESSAGE.SEPARATOR,
      color: 11962861,
      thumbnail: {
        url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/Infoicon.png`,
      },
      author: {
        name: 'HOW TO ADD/REMOVE SELECTED ROLES',
        icon_url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/AlfredBotlericon.png`,
      },
      fields: [
        {
          name: 'Step by step guide:',
          value: '1. Select a role (see available roles below)\n2. Write the command \'!iam\' in the messagebox\n3. Add an empty space followed by your role',
        },
        {
          name: 'Example:',
          value: '*!iam gamedesigner*',
        },
        {
          name: 'Available Roles (https://lnk.armaldio.xyz/cc_roles):',
          value: Object.keys(this.variables.roles).join(', '),
        },
      ],
    };
  }
}
