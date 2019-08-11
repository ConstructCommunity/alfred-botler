import CONSTANTS from '../constants';
import Template from './Template';

export default class RoleToggle extends Template {
  constructor(variables) {
    super('role-toggle', variables, {
      icon: 'RoleDelicon',
      roleName: 'ROLE',
      toggleText: 'ADDED',
      roles: {
        role1: '111',
        role2: '222',
      },
    });
  }

  embed() {
    return {
      description: CONSTANTS.MESSAGE.SEPARATOR,
      color: 15844367,
      thumbnail: {
        url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/${this.variables.icon}.png`,
      },
      author: {
        name: `${this.variables.roleName} ROLE HAS BEEN ${this.variables.toggleText}!`,
        icon_url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordEditicon.png`,
      },
      fields: [
        {
          name: 'Role List:',
          value: '*!rolelist*',
        },
      ],
    };
  }
}
