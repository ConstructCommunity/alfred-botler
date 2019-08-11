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
          name: 'Exclusive Roles:',
          value: '**Nitro Supporter:** Members server boosting with Nitro.\nᅠ',
        },
        {
          name: 'Roles For Members:',
          value: '**Expert:** *!iam expert*\n**Code Dev:** *!iam dev*\n**Game Artist:** *!iam artist*\n**Game Designer:** *!iam gamedesigner*\n**Sound Designer:** *!iam sounddesigner*\n**Multimedia Dev:** *!iam multimediadev*\nᅠ',
        },
        {
          name: 'Roles With Application Process:',
		value: '**Helper:** Members providing in-depth help.\n**Staff:** Members from exclusive platforms.\n**Tester:** Members that help with testing things.\nᅠ',
        },
      ],
	  footer: {
        text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
      },
    };
  }
}
