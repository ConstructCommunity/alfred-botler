/**
 * Created by Armaldio on 11/12/2017.
 */

import { Command } from 'discord.js-commando';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';

const roles = {
  expert: CONSTANTS.ROLES.EXPERT,
  dev: CONSTANTS.ROLES.DEV,
  artist: CONSTANTS.ROLES.ARTIST,
  gamedesigner: CONSTANTS.ROLES.GAME_DESIGNER,
  sounddesigner: CONSTANTS.ROLES.SOUND_DESIGNER,
  multimediadev: CONSTANTS.ROLES.MULTIMEDIADEV,
};

export default class iam extends Command {
  constructor(client) {
    super(client, {
      name: 'iam',
      group: 'general',
      memberName: 'iam',
      description: 'Add or remove a user from a role\nFor more infos, check https://lnk.armaldio.xyz/cc_roles',
      examples: ['iam dev', 'iam artist'],
      args: [
        {
          key: 'role',
          prompt: 'What role do you want ?',
          type: 'string',
        },
      ],
    });
  }

  hasPermission(msg) {
    const permissions = {
      roles: [CONSTANTS.ROLES.ANY],
      channels: [CONSTANTS.CHANNELS.ALFRED_COMMANDS],
    };
    return hasPermissions(this.client, permissions, msg);
  }

  // eslint-disable-next-line
  async run(msg, { role }) {
    const fun = [
      ['god', 'Sorry, Armaldio is our only god ...'],
      ['ashley', 'No, Ash is too busy adding features ;)'],
      ['armaldio', 'No, you are not.\nOr maybe you are. I don\'t know.'],
      ['helper', 'Helper role is an important thing. You must request it to a Staff member.'],
    ];

    let found = false;
    fun.forEach((entry) => {
      console.log(entry);
      if (entry[0] === role) {
        msg.reply(entry[1]);
        found = true;
      }
    });

    if (found) return;

    let icon = '';
    if (typeof roles[role] === 'undefined') {
      await msg.reply('Sorry, this role is invalid');
    } else if (msg.member.roles.has(roles[role])) {
      await msg.member.removeRole(roles[role]);
      icon = 'ROLEREMiconsmall';
    } else {
      await msg.member.addRole(roles[role]);
      icon = 'ROLEGETiconsmall';
    }

    await msg.channel.send({
      embed: {
        description: CONSTANTS.MESSAGE.EMPTY,
        color: 15844367,
        footer: {
          text: '(Request custom roles by mentioning or PMing a staff member!)',
        },
        thumbnail: {
          url: `https://cdn.discordapp.com/attachments/244447929400688650/331776445947052042/${icon}.png`,
        },
        author: {
          name: `YOU NOW HAVE THE ${role.toUpperCase()} ROLE!`,
          icon_url: 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png',
        },
        fields: [
          {
            name: 'Available Roles (https://lnk.armaldio.xyz/cc_roles):',
            value: Object.keys(roles).join(', '),
          },
        ],
      },
    });
  }
}
