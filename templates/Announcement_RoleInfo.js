import CONSTANTS from '../constants';

import Template from './Template';

export default class RoleHelp extends Template {
  constructor(variables) {
    super('role-info', variables, {
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
        name: 'Construct Community Role List',
        icon_url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordNotifyicon.png`,
      },
      fields: [
        {
          name: 'Roles For Members:',
          value: '**RoleName:** !iam rolename\n**RoleName:** !iam rolename\n**RoleName:** !iam rolename\n**RoleName:** !iam rolename',
        },
        {
          name: 'Roles With Application Process:',
          value: '**RoleName:** !iam rolename\n**RoleName:** !iam rolename\n**RoleName:** !iam rolename\n**RoleName:** !iam rolename',
        },
      ],
	  footer: {
        text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
      },
    };
  }
}
