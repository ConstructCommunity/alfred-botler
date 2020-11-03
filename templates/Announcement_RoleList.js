import CONSTANTS from '../constants';
import Template from './Template';

// `**${role.displayName}:** \`!iam ${role.shortName}\``

export default class Rolelist extends Template {
  constructor() {
    super('rolelist', {}, {});
  }

  // eslint-disable-next-line class-methods-use-this
  embed() {
    const everyoneRoles = Object.entries(CONSTANTS.ROLES)
      .filter(([key, value]) => !value.requireApplication && !value.hideInList)
      .map(([key, role]) => `**<@&${role.id}>${role.pingable ? '\*' : ''}:** \`!iam ${role.shortName}\``)
      .join('\n');
    const applicationRoles = Object.entries(CONSTANTS.ROLES)
      .filter(([key, value]) => value.requireApplication && !value.hideInList)
      .map(([key, role]) => `**<@&${role.id}>${role.pingable ? '\*' : ''}:** ${role.description}`)
      .join('\n');

    return {
      description: CONSTANTS.MESSAGE.SEPARATOR,
      color: 11962861,
      thumbnail: {
        url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/Infoicon.png`,
      },
      author: {
        name: 'ROLE LIST',
        icon_url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordNotifyicon.png`,
      },
      fields: [
        {
          name: 'Exclusive Roles:',
          value: `${applicationRoles}\nᅠ`,
        },
        {
          name: 'Roles For Members:',
          value: `${everyoneRoles}\nᅠ`,
        },
        {
          name: '**This Role can be mentioned by Members*',
          value: 'ᅠ',
        },
      ],
      footer: {
        text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
      },
    };
  }
}
