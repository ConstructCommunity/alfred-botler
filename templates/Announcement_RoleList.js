import { MessageEmbed } from 'discord.js';
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
      .map(([key, role]) => `**${role.displayName}${role.pingable ? '\*' : ''}:** \`!iam ${role.shortName}\``)
      .join('\n');
    const applicationRoles = Object.entries(CONSTANTS.ROLES)
      .filter(([key, value]) => value.requireApplication && !value.hideInList)
      .map(([key, role]) => `**${role.displayName}:** ${role.description}`)
      .join('\n');

    return {
      description: CONSTANTS.MESSAGE.SEPARATOR,
      color: 11962861,
      thumbnail: {
        url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/Infoicon.png`,
      },
      author: {
        name: 'CONSTRUCT COMMUNITY ROLE LIST',
        icon_url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordNotifyicon.png`,
      },
      fields: [
        {
          name: 'Exclusive Roles:',
          value: `**Nitro Booster:** Members server boosting with Nitro.\n${applicationRoles}\nᅠ`,
        },
        {
          name: 'Roles For Members:',
          value: `${everyoneRoles}\nᅠ`,
        },
        {
          name: '*: This role can be mentioned by members',
          value: 'ᅠ',
        },
      ],
      footer: {
        text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
      },
    };
  }
}
